"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _app_1 = __importDefault(require("../index"));
//Express Swagger Generator
/* EXPRESS SWAGGER OPTIONS */
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost',
        basePath: '/',
        swagger: '2.0',
        //openapi: '3.0.0',
        produces: [
            "application/json"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname,
    files: ['./**/*.ts'] //Path to the API handle folder
};
//SWAGGER DATA LOAD ENABLER MIDDLEWARE FOR BROWSER
const EnableSwaggerOnBrowser = (app) => {
    app.get("/api-docs", (req, res, next) => {
        res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'; img-src 'self' data:;");
        next();
    });
};
/* EXPRESS SWAGGER CONFIGURATION */
const SwaggerDocsCreator = (app) => {
    const ExpressSwaggerFn = (0, _app_1.default)(app);
    EnableSwaggerOnBrowser(app);
    ExpressSwaggerFn(swaggerOptions);
};
const app = (0, express_1.default)();
const router = express_1.default.Router();
router.post("/", function () { });
router.get('/test', function () { });
app.use("/api", router);
SwaggerDocsCreator(app);
app.listen(80, () => {
    console.log("Server is running on port 80");
});
exports.default = app;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3Qvcm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTJFO0FBQzNFLGdEQUFrQztBQUdsQywyQkFBMkI7QUFFM0IsNkJBQTZCO0FBQzdCLE1BQU0sY0FBYyxHQUFXO0lBQzNCLGlCQUFpQixFQUFFO1FBQ2YsSUFBSSxFQUFFO1lBQ0YsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxLQUFLLEVBQUUsU0FBUztZQUNoQixPQUFPLEVBQUUsT0FBTztTQUNuQjtRQUNELElBQUksRUFBRSxXQUFXO1FBQ2pCLFFBQVEsRUFBRSxHQUFHO1FBQ2IsT0FBTyxFQUFFLEtBQUs7UUFDZCxtQkFBbUI7UUFDbkIsUUFBUSxFQUFFO1lBQ04sa0JBQWtCO1NBQ3JCO1FBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQztRQUMxQixtQkFBbUIsRUFBRTtZQUNqQixHQUFHLEVBQUU7Z0JBQ0QsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsRUFBRSxFQUFFLFFBQVE7Z0JBQ1osSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLFdBQVcsRUFBRSxFQUFFO2FBQ2xCO1NBQ0o7S0FDSjtJQUNELE9BQU8sRUFBRSxTQUFTO0lBQ2xCLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLCtCQUErQjtDQUN2RCxDQUFDO0FBR0Ysa0RBQWtEO0FBRWxELE1BQU0sc0JBQXNCLEdBQTZCLENBQUMsR0FBWSxFQUFFLEVBQUU7SUFDdEUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3BDLEdBQUcsQ0FBQyxHQUFHLENBQ0gseUJBQXlCLEVBQ3pCLDJJQUEySSxDQUM5SSxDQUFBO1FBQ0QsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUMsQ0FBQTtBQUdELG1DQUFtQztBQUNuQyxNQUFNLGtCQUFrQixHQUFHLENBQUMsR0FBWSxFQUFFLEVBQUU7SUFDeEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLGNBQWMsRUFBQyxHQUFHLENBQUMsQ0FBQztJQUM3QyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUE7QUFHRCxNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUN0QixNQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFFbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUNyQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUV4QixrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV4QixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUU7SUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2hELENBQUMsQ0FBQyxDQUFDO0FBQ0gsa0JBQWUsR0FBRyxDQUFDIn0=