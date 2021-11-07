# Node API Kit

A simple, handy and intuitive NodeJS API toolkit that lazy programmers will love.
Simply install the API Kit with:

```sh
npm i @iannisz/node-api-kit
```

and save yourself a lot of time!

### Example

```ts
import { createAPI, readJSONBody, createToken } from '@iannisz/node-api-kit'

// Create an API that listens on port 3000.

const api = createAPI(3000)

// Simple public route that sends back "Hello, World!".

api.get('/', (req, res) => {
	res.end('Hello, World!')
})

// JSON APIs made easy.

api.post('/json', async (req, res) => {
	try {
		const body = await readJSONBody(req)
		const { message } = body

		if (message == null) {
			res.statusCode = 400
			res.end(`Missing "message" field in body`)
			return
		}

		res.end(`I received your message "${ message }"!`)
	}
	catch {
		res.statusCode = 400
		res.end(`Bad body`)
	}
}, {
	needAuth: true // User needs to provide a valid API token.
})

// Create a dummy API token that we can use to test our API.

console.log(`Test API token: ${ createToken({ user: 'test' }) }`)
```