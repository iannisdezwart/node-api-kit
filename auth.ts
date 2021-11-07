import * as fs from 'fs'
import * as jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

if (!fs.existsSync('.jwtsecret')) {
	fs.writeFileSync('.jwtsecret', randomBytes(128).toString('base64'))
}

const SECRET = fs.readFileSync('.jwtsecret', 'utf-8')

/**
 * Internal function that is used to check if an api token is valid.
 * @param apiToken The api token to check.
 * @returns the payload if the token is valid, false otherwise.
 */
export const authenticated = (apiToken: string) => {
	try {
		return jwt.verify(apiToken, SECRET)
	}
	catch {
		return false
	}
}

/**
 * Creates a new API token.
 * @param payload The payload of the token. Can be any JSON-serializable object.
 * @returns a JWT token.
 */
export const createToken = (payload: any) => {
	return jwt.sign(payload, SECRET)
}