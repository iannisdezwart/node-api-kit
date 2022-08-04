import * as http from 'http'
import { Method, Route, RouteOptions } from './route'
import { authenticated } from './auth'

/**
 * Structure containing the routes of an API.
 * You can add a route with the `addRoute()` function, or one of the
 * `get()`, `post()`, ... functions.
 */
export class API {
	routes: Map<string, Route[]> = new Map()

	/**
	 * Adds a route to the API.
	 * @param method The method of the route.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	addRoute(
		method: Method,
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		options = {
			needAuth: false,
			...options,
		}

		if (this.routes.get(path) == null) {
			this.routes.set(path, [])
		}

		this.routes.get(path)!.push({
			method,
			options,
			handler
		})
	}

	/**
	 * Adds a GET route to the API.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	get(
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		this.addRoute('GET', path, handler, options)
	}

	/**
	 * Adds a POST route to the API.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	post(
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		this.addRoute('POST', path, handler, options)
	}

	/**
	 * Adds a PUT route to the API.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	put(
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		this.addRoute('PUT', path, handler, options)
	}

	/**
	 * Adds a DELETE route to the API.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	delete(
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		this.addRoute('DELETE', path, handler, options)
	}

	/**
	 * Adds a PATCH route to the API.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	patch(
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		this.addRoute('PATCH', path, handler, options)
	}

	/**
	 * Adds a HEAD route to the API.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	head(
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		this.addRoute('HEAD', path, handler, options)
	}

	/**
	 * Adds a OPTIONS route to the API.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	options(
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		this.addRoute('OPTIONS', path, handler, options)
	}

	/**
	 * Adds a CONNECT route to the API.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	connect(
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		this.addRoute('CONNECT', path, handler, options)
	}

	/**
	 * Adds a TRACE route to the API.
	 * @param path The path of the route.
	 * @param handler A handler callback for the route.
	 * @param options Additional options.
	 */
	trace(
		path: string,
		handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
		options?: RouteOptions
	) {
		this.addRoute('TRACE', path, handler, options)
	}
}

/**
 * Creates a new API.
 * @param port The port to listen on.
 * @returns An API instance.
 * This API instance can be used to add routes to the API.
 * See `API.addRoute()`, `API.get()`, `API.post()`, ... for more information.
 */
export const createAPI = (port: number) => {
	const api = new API()

	const server = http.createServer((req, res) => {
		const url = new URL(req.url || '', 'http://localhost')
		const path = url.pathname

		if (req.method == null)
		{
			res.statusCode = 400
			res.end('Missing method')
			return
		}

		const method = req.method.toUpperCase() as Method

		if (!api.routes.has(path)) {
			res.statusCode = 404
			res.end('Not Found')
			return
		}

		const route = api.routes
			.get(path)
			?.find(route => route.method == method)

		if (route == null) {
			res.statusCode = 405
			res.end('Method Not Allowed')
			return
		}

		if (route.options.needAuth) {
			const apiToken = req.headers['x-api-token'] as string

			if (!authenticated(apiToken)) {
				res.statusCode = 401
				res.end('Unauthorized')
				return
			}
		}

		route.handler(req, res)
	})

	server.listen(port, () => {
		console.log(`API listening on port ${ port }`)
	})

	return api
}