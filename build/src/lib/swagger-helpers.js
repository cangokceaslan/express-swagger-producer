'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDeprecated = exports.addDataToSwaggerObject = exports.swaggerizeObj = void 0;
// Dependencies.
const recursive_iterator_1 = __importDefault(require("recursive-iterator"));
/**
 * Checks if tag is already contained withing target.
 * The tag is an object of type http://swagger.io/specification/#tagObject
 * The target, is the part of the swagger specification that holds all tags.
 * @function
 * @param {object} target - Swagger object place to include the tags data.
 * @param {object} tag - Swagger tag object to be included.
 * @returns {boolean} Does tag is already present in target
 */
function _tagDuplicated(target, tag) {
    // Check input is workable.
    if (target && target.length && tag) {
        for (let i = 0; i < target.length; i = i + 1) {
            let targetTag = target[i];
            // The name of the tag to include already exists in the taget.
            // Therefore, it's not necessary to be added again.
            if (targetTag.name === tag.name) {
                return true;
            }
        }
    }
    // This will indicate that `tag` is not present in `target`.
    return false;
}
/**
 * Adds the tags property to a swagger object.
 * @function
 * @param {object} conf - Flexible configuration.
 */
function _attachTags(conf) {
    let tag = conf.tag;
    let swaggerObject = conf.swaggerObject;
    let propertyName = conf.propertyName;
    // Correct deprecated property.
    if (propertyName === 'tag') {
        propertyName = 'tags';
    }
    if (Array.isArray(tag)) {
        for (let i = 0; i < tag.length; i = i + 1) {
            if (!_tagDuplicated(swaggerObject[propertyName], tag[i])) {
                swaggerObject[propertyName].push(tag[i]);
            }
        }
    }
    else {
        if (!_tagDuplicated(swaggerObject[propertyName], tag)) {
            swaggerObject[propertyName].push(tag);
        }
    }
}
/**
 * Merges two objects
 * @function
 * @param {object} obj1 - Object 1
 * @param {object} obj2 - Object 2
 * @returns {object} Merged Object
 */
function _objectMerge(obj1, obj2) {
    let obj3 = {};
    for (let attr in obj1) {
        if (obj1.hasOwnProperty(attr)) {
            obj3[attr] = obj1[attr];
        }
    }
    for (let name in obj2) {
        if (obj2.hasOwnProperty(name)) {
            obj3[name] = obj2[name];
        }
    }
    return obj3;
}
/**
 * Adds necessary swagger schema object properties.
 * @see https://goo.gl/Eoagtl
 * @function
 * @param {object} swaggerObject - The object to receive properties.
 * @returns {object} swaggerObject - The updated object.
 */
function swaggerizeObj(swaggerObject) {
    //swaggerObject.swagger = '2.0';
    swaggerObject.paths = swaggerObject.paths || {};
    swaggerObject.definitions = swaggerObject.definitions || {};
    swaggerObject.responses = swaggerObject.responses || {};
    swaggerObject.parameters = swaggerObject.parameters || {};
    swaggerObject.securityDefinitions = swaggerObject.securityDefinitions || {};
    swaggerObject.tags = swaggerObject.tags || [];
    return swaggerObject;
}
exports.swaggerizeObj = swaggerizeObj;
/**
 * List of deprecated or wrong swagger schema properties in singular.
 * @function
 * @returns {array} The list of deprecated property names.
 */
function _getSwaggerSchemaWrongProperties() {
    return [
        'consume',
        'produce',
        'path',
        'tag',
        'definition',
        'securityDefinition',
        'scheme',
        'response',
        'parameter',
        'deprecated'
    ];
}
/**
 * Makes a deprecated property plural if necessary.
 * @function
 * @param {string} propertyName - The swagger property name to check.
 * @returns {string} The updated propertyName if neccessary.
 */
function _correctSwaggerKey(propertyName) {
    let wrong = _getSwaggerSchemaWrongProperties();
    if (wrong.indexOf(propertyName) > 0) {
        // Returns the corrected property name.
        return propertyName + 's';
    }
    return propertyName;
}
/**
 * Handles swagger propertyName in pathObject context for swaggerObject.
 * @function
 * @param {object} swaggerObject - The swagger object to update.
 * @param {object} pathObject - The input context of an item for swaggerObject.
 * @param {string} propertyName - The property to handle.
 */
function _organizeSwaggerProperties(swaggerObject, pathObject, propertyName) {
    let simpleProperties = [
        'consume',
        'consumes',
        'produce',
        'produces',
        // 'path',
        // 'paths',
        'schema',
        'schemas',
        'securityDefinition',
        'securityDefinitions',
        'response',
        'responses',
        'parameter',
        'parameters',
        'definition',
        'definitions',
    ];
    // Common properties.
    if (simpleProperties.indexOf(propertyName) !== -1) {
        let keyName = _correctSwaggerKey(propertyName);
        let definitionNames = Object
            .getOwnPropertyNames(pathObject[propertyName]);
        for (let k = 0; k < definitionNames.length; k = k + 1) {
            let definitionName = definitionNames[k];
            swaggerObject[keyName][definitionName] =
                pathObject[propertyName][definitionName];
        }
        // Tags.
    }
    else if (propertyName === 'tag' || propertyName === 'tags') {
        let tag = pathObject[propertyName];
        _attachTags({
            tag: tag,
            swaggerObject: swaggerObject,
            propertyName: propertyName,
        });
        // Paths.
    }
    else {
        let routes = Object
            .getOwnPropertyNames(pathObject[propertyName]);
        for (let k = 0; k < routes.length; k = k + 1) {
            let route = routes[k];
            if (!swaggerObject.paths) {
                swaggerObject.paths = {};
            }
            swaggerObject.paths[route] = _objectMerge(swaggerObject.paths[route], pathObject[propertyName][route]);
        }
    }
}
/**
 * Adds the data in to the swagger object.
 * @function
 * @param {object} swaggerObject - Swagger object which will be written to
 * @param {object[]} data - objects of parsed swagger data from yml or jsDoc
 *                          comments
 */
function addDataToSwaggerObject(swaggerObject, data) {
    if (!swaggerObject || !data) {
        throw new Error('swaggerObject and data are required!');
    }
    for (let i = 0; i < data.length; i = i + 1) {
        let pathObject = data[i];
        let propertyNames = Object.getOwnPropertyNames(pathObject);
        // Iterating the properties of the a given pathObject.
        for (let j = 0; j < propertyNames.length; j = j + 1) {
            let propertyName = propertyNames[j];
            // Do what's necessary to organize the end specification.
            _organizeSwaggerProperties(swaggerObject, pathObject, propertyName);
        }
    }
}
exports.addDataToSwaggerObject = addDataToSwaggerObject;
/**
 * Aggregates a list of wrong properties in problems.
 * Searches in object based on a list of wrongSet.
 * @param {Array|object} list - a list to iterate
 * @param {Array} wrongSet - a list of wrong properties
 * @param {Array} problems - aggregate list of found problems
 */
function seekWrong(list, wrongSet, problems) {
    let iterator = new recursive_iterator_1.default(list, 0, false, 100);
    for (let item = iterator.next(); !item.done; item = iterator.next()) {
        let isDirectChildOfProperties = item.value.path[item.value.path.length - 2] === 'properties';
        if (wrongSet.indexOf(item.value.key) > 0 && !isDirectChildOfProperties) {
            problems.push(item.value.key);
        }
    }
}
/**
 * Returns a list of problematic tags if any.
 * @function
 * @param {Array} sources - a list of objects to iterate and check
 * @returns {Array} problems - a list of problems encountered
 */
function findDeprecated(sources) {
    let wrong = _getSwaggerSchemaWrongProperties();
    // accumulate problems encountered
    let problems = [];
    sources.forEach(function (source) {
        // Iterate through `source`, search for `wrong`, accumulate in `problems`.
        seekWrong(source, wrong, problems);
    });
    return problems;
}
exports.findDeprecated = findDeprecated;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhZ2dlci1oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zd2FnZ2VyLWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7QUFFYixnQkFBZ0I7QUFDaEIsNEVBQW1EO0FBRW5EOzs7Ozs7OztHQVFHO0FBQ0gsU0FBUyxjQUFjLENBQUMsTUFBVyxFQUFFLEdBQVE7SUFDNUMsMkJBQTJCO0lBQzNCLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxFQUFFO1FBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdDLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQiw4REFBOEQ7WUFDOUQsbURBQW1EO1lBQ25ELElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxFQUFFO2dCQUNoQyxPQUFPLElBQUksQ0FBQzthQUNaO1NBQ0Q7S0FDRDtJQUVELDREQUE0RDtJQUM1RCxPQUFPLEtBQUssQ0FBQztBQUNkLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxXQUFXLENBQUMsSUFBUztJQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ25CLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDdkMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUVyQywrQkFBK0I7SUFDL0IsSUFBSSxZQUFZLEtBQUssS0FBSyxFQUFFO1FBQzNCLFlBQVksR0FBRyxNQUFNLENBQUM7S0FDdEI7SUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdkIsS0FBSyxJQUFJLENBQUMsR0FBRyxD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