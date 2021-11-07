import * as http from 'http'

/**
 * Reads a body of a request asynchronously.
 * @param req The request to read.
 * @returns A string containing the body of the request.
 */
 export const readBody = (
	req: http.IncomingMessage
) => new Promise<string>((resolve, reject) => {
	let body = ''

	req.on('data', (chunk) => {
		body += chunk
	})

	req.on('end', () => {
		resolve(body)
	})

	req.on('error', (err) => {
		reject(err)
	})
})

/**
 * Reads a body of a request asynchronously and parses it as JSON.
 * @param req The request to read.
 * @returns The body as an object.
 * @throws If the body cannot be parsed as JSON.
 */
export const readJSONBody = async (
	req: http.IncomingMessage
) => JSON.parse(await readBody(req))