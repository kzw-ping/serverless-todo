import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const todosTable = process.env.TODOS_TABLE
const attachName = process.env.ATTACH_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const attachId = uuid.v4()

  const url = getUploadUrl(attachId)
  const attachmentUrl = `https://${attachName}.s3.amazonaws.com/${attachId}`
  await docClient.update({
    TableName : todosTable,
    Key: {"todoId": todoId},
    UpdateExpression: "set attachmentUrl=:a",
    ExpressionAttributeValues:{
      ":a": attachmentUrl,
    },
    ReturnValues:"UPDATED_NEW"
}).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      attachmentUrl: attachmentUrl,
      uploadUrl: url 
    })
  }
}

function getUploadUrl(attachId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: attachName,
    Key: attachId,
    Expires: parseInt(urlExpiration)
  })
}