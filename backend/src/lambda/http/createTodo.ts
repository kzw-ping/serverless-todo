import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDoItem } from '../../businessLogic/todos'
// import * as AWS  from 'aws-sdk'
// import * as uuid from 'uuid'
import { getUserId } from '../../lambda/utils'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  // const itemId = uuid.v4()
  const userId = getUserId(event)
  const newTodoItem = await createToDoItem(newTodo, userId)
  // const newItem = {
  //   todoId: itemId,
  //   // store userId in DynamoDB
  // userId: userId,
  //   ...newTodo
  // }

  // await docClient.put({
  //   TableName: todosTable,
  //   Item: newItem
  // }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newTodoItem
    })
  }
}
