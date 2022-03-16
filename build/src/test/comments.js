"use strict";
/**
 * JSON parameters require a model. This one just has "name"
 * @typedef ReqNameJSON
 * @property {string} name.required - name of person making request - eg: John Doe
 */
/**
 * This route will respond greetings to name in json request body.
 * @route POST /hello/
 * @group hello - Test Demo
 * @param {ReqNameJSON.model} name.body.required - username or email
 * @returns {object} 200 - An object with the key 'msg'
 * @returns {Error}  default - Unexpected error
 * @headers {integer} 200.X-Rate-Limit - calls per hour allowed by the user
 * @headers {string} 200.X-Expires-After - 	date in UTC when token expires
 * @produces application/json
 * @consumes application/json
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
 * @property {Array.<Color>} Color
 */
/**
 * @typedef Color
 * @property {string} blue
 */
/**
 * @route GET /test/
 * @returns {Array.<Point>} Point - Some description for point
 */
exports.default = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdC9jb21tZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRztBQUNIOzs7Ozs7Ozs7OztHQVdHOztBQUdIOzs7OztHQUtHO0FBRUg7Ozs7O0dBS0c7QUFFSDs7O0dBR0c7QUFFSDs7O0dBR0c7QUFFSCxrQkFBZSxFQUFFLENBQUMifQ==