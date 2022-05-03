# Express Swagger Producer:

This module has same logic with [express-swagger-generator](https://npmjs.com/package/express-swagger-generator) library which currently doesn't support TS (TypeScript) environment or getting updates. This module is written with TS (TypeScript) and supports TS (TypeScript) environment. 

In addition to TypeScript environment support, this module has one more feature than express-swagger-generator. You can use swagger & openapi version keys with options as down below.

You can visit [cangokceaslan.com](https://www.cangokceaslan.com) for more details

<a href="https://www.buymeacoffee.com/cangokceaslan"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="200" /></a>

#### Installation

```
npm i express-swagger-producer
```

#### Usage

```javascript
const express = require('express');
const app = express();
const ExpressSwaggerFn = require('express-swagger-producer');

let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a server with enabled Swagger documentation feature',
            title: 'Simple Server',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        swagger:'2.0', //  or openapi:'3.0.0'
        basePath: '/v1',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
		securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "Basic apiKey authorization in the system",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/**/*.js'] //Path to the API handle folder
};

const ExpressSwagger = ExpressSwaggerFn(app); // Please add this line where your routes layer starts
ExpressSwagger(options); // Enable this if you want to generate Swagger document
app.listen(3000);
```

Open http(s)://<app_host>:<app_port>/api-docs in your browser to view the documentation.
You can find the swagger.json at http(s)://<app_host>:<app_port>/api-docs.json

#### How to document the API

```javascript
/**
 * This function comment is parsed by doctrine
 * @route GET /api
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
exports.foo = function() {}
```

For model definitions:

```javascript
/**
 * @typedef Product
 * @property {integer} id
 * @property {string} name.required - Some description for product
 * @property {Array.<Point>} Point
 */

/**
 * @typedef Point
 * @property {integer} x.required
 * @property {integer} y.required - Some description for point - eg: 1234
 * @property {string} color
 * @property {enum} status - Status values that need to be considered for filter - eg: available,pending
 */

/**
 * @typedef Error
 * @property {string} code.required
 */

/**
 * @typedef Response
 * @property {[integer]} code
 */


/**
 * This function comment is parsed by doctrine
 * Test Route
 * @route POST /users
 * @param {Point.model} point.body.required - the new point
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email
 * @param {string} password.query.required - user's password.
 * @param {enum} status.query.required - Status values that need to be considered for filter - eg: available,pending
 * @operationId retrieveFooInfo
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {Response.model} 200 - An array of user info
 * @returns {Product.model}  default - Unexpected error
 * @returns {Array.<Point>} Point - Some description for point
 * @headers {integer} 200.X-Rate-Limit - calls per hour allowed by the user
 * @headers {string} 200.X-Expires-After - 	date in UTC when token expires
 * @security JWT
 */
```