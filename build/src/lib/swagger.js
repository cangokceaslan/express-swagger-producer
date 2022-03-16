/**
 * Created by GROOT on 3/27 0027.
 */
/** @module index */
'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSpecAndMount = exports.fileFormat = exports.parseApiFile = void 0;
// Dependencies
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const swagger_parser_1 = __importDefault(require("swagger-parser"));
const swaggerHelpers = __importStar(require("../../lib/swagger-helpers"));
const doctrineFile = __importStar(require("doctrine-file"));
//const swaggerUi = require('swagger-ui-express');
const express_swaggerize_ui_1 = __importDefault(require("express-swaggerize-ui"));
/**
 * Parses the provided API file for JSDoc comments.
 * @function
 * @param {string} file - File to be parsed
 * @returns {object} JSDoc comments
 * @requires doctrine
 */
function parseApiFile(file) {
    const content = fs_1.default.readFileSync(file, 'utf-8');
    let comments = doctrineFile.parseFileContent(content, { unwrap: true, sloppy: true, tags: null, recoverable: true });
    return comments;
}
exports.parseApiFile = parseApiFile;
function parseRoute(str) {
    let split = str.split(" ");
    return {
        method: split[0].toLowerCase() || 'get',
        uri: split[1] || ''
    };
}
function parseField(str) {
    let split = str.split(".");
    return {
        name: split[0],
        parameter_type: split[1] || 'get',
        required: split[2] && split[2] === 'required' || false
    };
}
function parseType(obj) {
    if (!obj)
        return undefined;
    if (obj.name) {
        const spl = obj.name.split('.');
        if (spl.length > 1 && spl[1] == 'model') {
            return spl[0];
        }
        else
            return obj.name;
    }
    else if (obj.expression && obj.expression.name) {
        return obj.expression.name.toLowerCase();
    }
    else {
        return 'string';
    }
}
function parseSchema(obj) {
    if (!(obj.name || obj.applications))
        return undefined;
    if (obj.name) {
        const spl = obj.name.split('.');
        if (spl.length > 1 && spl[1] == 'model') {
            return { "$ref": "#/definitions/" + spl[0] };
        }
        else
            return undefined;
    }
    if (obj.applications) {
        if (obj.applications.length === 1) {
            const type = obj.applications[0].name;
            if (type == 'object' || type == 'string' || type == 'integer' || type == 'boolean') {
                return {
                    type: obj.expression.name.toLowerCase(),
                    items: {
                        "type": type
                    }
                };
            }
            else {
                return {
                    type: obj.expression.name.toLowerCase(),
                    items: {
                        "$ref": "#/definitions/" + obj.applications[0].name
                    }
                };
            }
        }
        let oneOf = [];
        for (let i in obj.applications) {
            const type = obj.applications[i].name;
            if (type == 'object' || type == 'string' || type == 'integer' || type == 'boolean') {
                oneOf.push({
                    "type": type
                });
            }
            else {
                oneOf.push({
                    "$ref": "#/definitions/" + obj.applications[i].name
                });
            }
            return {
                type: obj.expression.name.toLowerCase(),
                items: {
                    oneOf: oneOf
                }
            };
        }
    }
    return undefined;
}
function parseItems(obj) {
    if (obj.applications && obj.applications.length > 0 && obj.applications[0].name) {
        const type = obj.applications[0].name;
        if (type == 'object' || type == 'string' || type == 'integer' || type == 'boolean') {
            return { "type": type };
        }
        else
            return { "$ref": "#/definitions/" + type };
    }
    else
        return undefined;
}
function parseReturn(tags) {
    let rets = {};
    let headers = parseHeaders(tags);
    for (let i in tags) {
        if (tags[i]['title'] == 'returns' || tags[i]['title'] == 'return') {
            let description = tags[i]['description'].split("-"), key = description[0].trim();
            rets[key] = {
                description: description[1] ? description[1].trim() : '',
                headers: headers[key]
            };
            const type = parseType(tags[i].type);
            if (type) {
                // rets[key].type = type;
                rets[key].schema = parseSchema(tags[i].type);
            }
        }
    }
    return rets;
}
function parseDescription(obj) {
    const description = obj.description || '';
    const sanitizedDescription = description.replace('/**', '');
    return sanitizedDescription;
}
function parseTag(tags) {
    for (let i in tags) {
        if (tags[i]['title'] == 'group') {
            return tags[i]['description'].split("-");
        }
    }
    return ['default', ''];
}
function parseProduces(str) {
    return str.split(/\s+/);
}
function parseConsumes(str) {
    return str.split(/\s+/);
}
function parseTypedef(tags) {
    const typeName = tags[0]['name'];
    let details = {
        required: [],
        properties: {},
        allOf: []
    };
    if (tags[0].type && tags[0].type.name) {
        details.allOf = [{ "$ref": '#/definitions/' + tags[0].type.name }];
    }
    for (let i = 1; i < tags.length; i++) {
        if (tags[i].title == 'property') {
            let propName = tags[i].name;
            let propNameArr = propName.split(".");
            let props = propNameArr.slice(1, propNameArr.length);
            let required = props.indexOf('required') > -1;
            let readOnly = props.indexOf('readOnly') > -1;
            if (required) {
                if (details.required == null)
                    details.required = [];
                propName = propName.split('.')[0];
                details.required.push(propName);
            }
            var schema = parseSchema(tags[i].type);
            if (schema) {
                details.properties[propName] = schema;
            }
            else {
                const type = parseType(tags[i].type);
                const parsedDescription = (tags[i].description || '').split(/-\s*eg:\s*/);
                const description = parsedDescription[0];
                const example = parsedDescription[1];
                let prop = {
                    type: type,
                    description: description,
                    items: parseItems(tags[i].type),
                    readOnly: false,
                    enum: []
                };
                if (readOnly) {
                    prop.readOnly = true;
                }
                details.properties[propName] = prop;
                if (prop.type == 'enum') {
                    let parsedEnum = parseEnums('-eg:' + example);
                    prop.type = parsedEnum.type;
                    prop.enum = parsedEnum.enums;
                }
                if (example) {
                    switch (type) {
                        case 'boolean':
                            details.properties[propName].example = example === 'true';
                            break;
                        case 'integer':
                            details.properties[propName].example = +example;
                            break;
                        case 'enum':
                            break;
                        default:
                            details.properties[propName].example = example;
                            break;
                    }
                }
            }
        }
    }
    return { typeName, details };
}
function parseSecurity(comments) {
    let security;
    try {
        security = JSON.parse(comments);
    }
    catch (e) {
        let obj = {};
        obj[comments] = [];
        security = [
            obj
        ];
    }
    return security;
}
function parseHeaders(comments) {
    let headers = {};
    for (let i in comments) {
        if (comments[i]['title'] === 'headers' || comments[i]['title'] === 'header') {
            let description = comments[i]['description'].split(/\s+-\s+/);
            if (description.length < 1) {
                break;
            }
            let code2name = description[0].split(".");
            if (code2name.length < 2) {
                break;
            }
            let type = code2name[0].match(/\w+/);
            let code = code2name[0].match(/\d+/);
            if (!type || !code) {
                break;
            }
            let code0 = code[0].trim();
            if (!headers[code0]) {
                headers[code0] = {};
            }
            headers[code0][code2name[1]] = {
                type: type[0],
                description: description[1]
            };
        }
    }
    return headers;
}
function parseEnums(description) {
    let enums = ('' + description).split(/-\s*eg:\s*/);
    if (enums.length < 2) {
        return [];
    }
    let parseType = enums[1].split(":");
    if (parseType.length === 1) {
        parseType = ['string', parseType[0]];
    }
    return {
        type: parseType[0],
        enums: parseType[1].split(",")
    };
}
function fileFormat(comments) {
    let route, parameters = {}, params = [], tags = [], definitions = {};
    for (let i in comments) {
        let desc = parseDescription(comments);
        if (i == 'tags') {
            if (comments[i].length > 0 && comments[i][0]['title'] && comments[i][0]['title'] == 'typedef') {
                const typedefParsed = parseTypedef(comments[i]);
                definitions[typedefParsed.typeName] = typedefParsed.details;
                continue;
            }
            for (let j in comments[i]) {
                let title = comments[i][j]['title'];
                if (title == 'route') {
                    route = parseRoute(comments[i][j]['description']);
                    let tag = parseTag(comments[i]);
                    parameters[route.uri] = parameters[route.uri] || {};
                    parameters[route.uri][route.method] = parameters[route.uri][route.method] || {};
                    parameters[route.uri][route.method]['parameters'] = [];
                    parameters[route.uri][route.method]['description'] = desc;
                    parameters[route.uri][route.method]['tags'] = [tag[0].trim()];
                    tags.push({
                        name: typeof tag[0] === 'string' ? tag[0].trim() : '',
                        description: typeof tag[1] === 'string' ? tag[1].trim() : ''
                    });
                }
                if (title == 'param') {
                    let field = parseField(comments[i][j]['name']), properties = {
                        name: field.name,
                        in: field.parameter_type,
                        description: comments[i][j]['description'],
                        required: field.required
                    }, schema = parseSchema(comments[i][j]['type']);
                    // we only want a type if there is no referenced schema
                    if (!schema) {
                        properties.type = parseType(comments[i][j]['type']);
                        if (properties.type == 'enum') {
                            let parsedEnum = parseEnums(comments[i][j]['description']);
                            properties.type = parsedEnum.type;
                            properties.enum = parsedEnum.enums;
                        }
                    }
                    else
                        properties.schema = schema;
                    params.push(properties);
                }
                if (title == 'operationId' && route) {
                    parameters[route.uri][route.method]['operationId'] = comments[i][j]['description'];
                }
                if (title == 'summary' && route) {
                    parameters[route.uri][route.method]['summary'] = comments[i][j]['description'];
                }
                if (title == 'produces' && route) {
                    parameters[route.uri][route.method]['produces'] = parseProduces(comments[i][j]['description']);
                }
                if (title == 'consumes' && route) {
                    parameters[route.uri][route.method]['consumes'] = parseConsumes(comments[i][j]['description']);
                }
                if (title == 'security' && route) {
                    parameters[route.uri][route.method]['security'] = parseSecurity(comments[i][j]['description']);
                }
                if (title == 'deprecated' && route) {
                    parameters[route.uri][route.method]['deprecated'] = true;
                }
                if (route) {
                    parameters[route.uri][route.method]['parameters'] = params;
                    parameters[route.uri][route.method]['responses'] = parseReturn(comments[i]);
                }
            }
        }
    }
    return { parameters: parameters, tags: tags, definitions: definitions };
}
exports.fileFormat = fileFormat;
/**
 * Filters JSDoc comments
 * @function
 * @param {object} jsDocComments - JSDoc comments
 * @returns {object} JSDoc comments
 * @requires js-yaml
 */
function filterJsDocComments(jsDocComments) {
    return jsDocComments.filter(function (item) {
        return item.tags.length > 0;
    });
}
/**
 * Converts an array of globs to full paths
 * @function
 * @param {array} globs - Array of globs and/or normal paths
 * @return {array} Array of fully-qualified paths
 * @requires glob
 */
function convertGlobPaths(base, globs) {
    return globs.reduce(function (acc, globString) {
        let globFiles = glob_1.default.sync(path_1.default.resolve(base, globString));
        return acc.concat(globFiles);
    }, []);
}
/**
 * Generates the swagger spec
 * @function
 * @param {object} options - Configuration options
 * @returns {array} Swagger spec
 * @requires swagger-parser
 */
function generateSpecAndMount(app) {
    return function (options) {
        /* istanbul ignore if */
        if (!options) {
            throw new Error('\'options\' is required.');
        }
        else /* istanbul ignore if */ if (!options.swaggerDefinition) {
            throw new Error('\'swaggerDefinition\' is required.');
        }
        else /* istanbul ignore if */ if (!options.files) {
            throw new Error('\'files\' is required.');
        }
        // Build basic swagger json
        let swaggerObject = swaggerHelpers.swaggerizeObj(options.swaggerDefinition);
        let apiFiles = convertGlobPaths(options.basedir, options.files);
        // Parse the documentation in the APIs array.
        for (let i = 0; i < apiFiles.length; i = i + 1) {
            let parsedFile = parseApiFile(apiFiles[i]);
            //console.log(JSON.stringify(parsedFile))
            let comments = filterJsDocComments(parsedFile);
            for (let j in comments) {
                try {
                    let parsed = fileFormat(comments[j]);
                    swaggerHelpers.addDataToSwaggerObject(swaggerObject, [{
                            paths: parsed.parameters,
                            tags: parsed.tags,
                            definitions: parsed.definitions
                        }]);
                }
                catch (e) {
                    console.log(`Incorrect comment format. Method was not documented.\nFile: ${apiFiles[i]}\nComment:`, comments[j]);
                }
            }
        }
        swagger_parser_1.default.parse(swaggerObject, function (err, api) {
            if (!err) {
                swaggerObject = api;
            }
        });
        let url = options.route ? options.route.url : '/api-docs';
        let docs = options.route ? options.route.docs : '/api-docs.json';
        app.use(docs, function (req, res) {
            res.json(swaggerObject);
        });
        app.use(url, (0, express_swaggerize_ui_1.default)({
            route: url,
            docs: docs
        }));
        return swaggerObject;
    };
}
exports.generateSpecAndMount = generateSpecAndMount;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc3dhZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILG9CQUFvQjtBQUNwQixZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWIsZUFBZTtBQUNmLDRDQUFvQjtBQUNwQixnREFBd0I7QUFDeEIsZ0RBQXdCO0FBQ3hCLG9FQUFvQztBQUNwQyxxRUFBdUQ7QUFDdkQsNERBQThDO0FBQzlDLGtEQUFrRDtBQUNsRCxrRkFBOEM7QUFFOUM7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsWUFBWSxDQUFDLElBQVM7SUFDbEMsTUFBTSxPQUFPLEdBQUcsWUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFL0MsSUFBSSxRQUFRLEdBQVEsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzFILE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUM7QUFMRCxvQ0FLQztBQUVELFNBQVMsVUFBVSxDQUFDLEdBQVc7SUFDM0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUUxQixPQUFPO1FBQ0gsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxLQUFLO1FBQ3ZDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTtLQUN0QixDQUFBO0FBQ0wsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLEdBQVc7SUFDM0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUMxQixP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