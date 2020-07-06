import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteToDoItem } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

// import * as AWS  from 'aws-sdk'

// const docClient = new AWS.DynamoDB.DocumentClient()

// const todosTable = process.env.TODOS_TABLE
const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info('Delete in progress ' + todoId)
  // TODO: Remove a TODO item by id

  await deleteToDoItem(todoId)

  // await docClient.delete ({
  //     TableName: todosTable,
  //     Key:{
  //         "todoId": todoId
  //     }
  // }).promise()

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
