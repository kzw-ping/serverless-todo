import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateToDoItem } from '../../businessLogic/todos'

// import * as AWS  from 'aws-sdk'

// const docClient = new AWS.DynamoDB.DocumentClient()

// const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  await updateToDoItem(updatedTodo, todoId)
  // await docClient.update({
  //   TableName : todosTable,
  //   Key: {"todoId": todoId},
  //   UpdateExpression: "set #n=:n, dueDate=:u, done=:d",
  //   ExpressionAttributeValues:{
  //     ":n": updatedTodo.name,
  //     ":u": updatedTodo.dueDate,
  //     ":d": updatedTodo.done
  //   },
  //   ExpressionAttributeNames:{
  //     "#n": "name"
  //   },
  //   ReturnValues:"UPDATED_NEW"
  // }).promise()

  // console.log('Delete result ' + result)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      body:''
    })
  }
}
