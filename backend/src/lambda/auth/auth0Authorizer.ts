import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://khine.us.auth0.com/.well-known/jwks.json'
const cert = `-----BEGIN CERTIFICATE-----
MIIC/zCCAeegAwIBAgIJOJjVFKQZoQ9WMA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNV
BAMTEmtoaW5lLnVzLmF1dGgwLmNvbTAeFw0yMDA2MjExMTQwNDBaFw0zNDAyMjgx
MTQwNDBaMB0xGzAZBgNVBAMTEmtoaW5lLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZI
hvcNAQEBBQADggEPADCCAQoCggEBALYY1FATMMBIedcOhxekt87lLO8BhSLp5oPj
HUfiwrE1gcg+9XlzPm5bsbxYn7ncZA1NBt9VBGdcD6czYLJpz2KNJsF7ClONiDuO
/cXdUzWZEa/7lVVL+wWZmxV6sHo/B44kDW6IToZbESJoYmw8AycQ8+5fIonj5NAL
uIosyePrFBMzrWSjN6XXvmubAf8kIwlV9q5uAtQc6+FmEW2NtfYp1jOMTLxb4oXI
0N7JF8rp4HVzavmneKjCngE5hGcA1yPGKrO4Dzn4oZJ7oXKvFClxPFoypXyAgjZc
uVrRT+VrpuAwqQluWwx/kITm3L4P7O8E4e30H2bWuhhWT3DxF/MCAwEAAaNCMEAw
DwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU3pUN3tPh5frgpGrqLxScSvFJULgw
DgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQBeWCS59e0hqgi1IuCD
hTGn2xWMjqJaffvzUrizRlnv7agHHn72tdp+/EwGyicZ5hFHrj/mnRNY8bBsPXET
iMYV0aFGnqCAW+EdNy7OrDxYKKn7j/NMphsKpnAiUavLjXldI88MJw1SRf2wBUoA
ct2ed2koyQZDxpLwA2BOaaxo0hGFFvvN1a9Hj4uNjP+0KIko9BlVl/O4rq6OsbVM
TBhrBd/0uHhYg3A+rUUllvkruufcQBuN83WgByrmwKwePfbKLFKyOU0R0EoL9hFU
T/QoXLvLHHVxw4Yoq2wGWNcLWdlMDdDyf/Txfza6dXgyOhum/uqon4vq7f+QBlcu
f4f4
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // if (!jwt) throw new Error('Invalid token')

  // const response = await Axios.get(jwksUrl)
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
