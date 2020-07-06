import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from "../requests/updateTodoRequest"
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
// import * as uuid from 'uuid'

const XAWS = AWSXRay.captureAWS(AWS)

export class ToDoAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todosTable = process.env.TODOS_TABLE,
      private readonly userIdIndex = process.env.USER_ID_INDEX) {
    }

    // Query all todo items for specific users
    async getAllToDoItems(userId : string): Promise<TodoItem[]> {
        console.log('Getting all groups')
    
        const result = await this.docClient.query({
            TableName : this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
      
            ScanIndexForward: false
        }).promise()
    
        const items = result.Items
        return items as TodoItem[]
      }
    
      async createToDoItem(newtodoItem: TodoItem): Promise<TodoItem> {
        
        await this.docClient.put({
          TableName: this.todosTable,
          Item: newtodoItem
        }).promise()
    
        return newtodoItem
      }

      async UpdateToDoItem(updateItem: TodoUpdate, todoId: string) {
        
        await this.docClient.update({
            TableName : this.todosTable,
            Key: {"todoId": todoId},
            UpdateExpression: "set #n=:n, dueDate=:u, done=:d",
            ExpressionAttributeValues:{
              ":n": updateItem.name,
              ":u": updateItem.dueDate,
              ":d": updateItem.done
            },
            ExpressionAttributeNames:{
              "#n": "name"
            },
            ReturnValues:"UPDATED_NEW"
          }).promise()
        }
    
        async DeleteToDoItem(todoId: string) {
        
            await this.docClient.delete ({
                TableName: this.todosTable,
                Key:{
                    "todoId": todoId
                }
            }).promise()
        }

        async GenerateUploadUrl(todoId: string, attachmentUrl: string) {
        
            await this.docClient.update({
                TableName : this.todosTable,
                Key: {"todoId": todoId},
                UpdateExpression: "set attachmentUrl=:a",
                ExpressionAttributeValues:{
                  ":a": attachmentUrl,
                },
                ReturnValues:"UPDATED_NEW"
            }).promise()
        }
    }

    function createDynamoDBClient() {
      if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
          region: 'localhost',
          endpoint: 'http://localhost:8000'
        })
      }
    
      return new XAWS.DynamoDB.DocumentClient()
}