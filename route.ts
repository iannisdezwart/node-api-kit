import * as http from 'http'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD'
	| 'OPTIONS' | 'CONNECT' | 'TRACE'

export interface Route {
	/**
	 * The HTTP method to match.
	 */
	method: Method

	/**
	 * A function that is called when a user requests the route.
	 */
	handler: (req: http.IncomingMessage, res: http.ServerResponse) => void

	/**
	 * Additional options for this route.
	 */
	options: RouteOptions
}

export interface RouteOptions {
	/**
	 * Boolean indicating whether a user has to be authenticated in order
	 * to access this route.
	 * If true, the route will be protected by a JWT token.
	 * The user then has to set the X-API-Token header.
	 * To create a JWT token, use the `createToken()` function.
	 * If false, the route will be public.
	 * @default false
	 */
	needAuth: boolean
}