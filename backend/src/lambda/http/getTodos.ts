import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

// import * as AWS  from 'aws-sdk'
import { getAllToDoItems } from '../../businessLogic/todos'
import { getUserId } from '../../lambda/utils'

// const docClient = new AWS.DynamoDB.DocumentClient()

// const todosTable = process.env.TODOS_TABLE
// const userIdIndex = process.env.USER_ID_INDEX

const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Processing event: ', event)

  const userId = getUserId(event)
  const todoitems = await getAllToDoItems(userId)
  
  // const result = await docClient.query({
  //     TableName : todosTable,
  //     IndexName: userIdIndex,
  //     KeyConditionExpression: 'userId = :userId',
  //     ExpressionAttributeValues: {
  //         ':userId': userId
  //     },

  //     ScanIndexForward: false
  // }).promise()

  // const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items:todoitems
    })
  }
}
