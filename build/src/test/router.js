"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _app_1 = __importDefault(require("../../index"));
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
        //swagger: '2.0',
        openapi: '3.0.0',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rlc3Qvcm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTJFO0FBQzNFLGdEQUFrQztBQUdsQywyQkFBMkI7QUFFM0IsNkJBQTZCO0FBQzdCLE1BQU0sY0FBYyxHQUFXO0lBQzNCLGlCQUFpQixFQUFFO1FBQ2YsSUFBSSxFQUFFO1lBQ0YsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxLQUFLLEVBQUUsU0FBUztZQUNoQixPQUFPLEVBQUUsT0FBTztTQUNuQjtRQUNELElBQUksRUFBRSxXQUFXO1FBQ2pCLFFBQVEsRUFBRSxHQUFHO1FBQ2IsaUJBQWlCO1FBQ2pCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFFBQVEsRUFBRTtZQUNOLGtCQUFrQjtTQUNyQjtRQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7UUFDMUIsbUJBQW1CLEVBQUU7WUFDakIsR0FBRyxFQUFFO2dCQUNELElBQUksRUFBRSxRQUFRO2dCQUNkLEVBQUUsRUFBRSxRQUFRO2dCQUNaLElBQUksRUFBRSxlQUFlO2dCQUNyQixXQUFXLEVBQUUsRUFBRTthQUNsQjtTQUNKO0tBQ0o7SUFDRCxPQUFPLEVBQUUsU0FBUztJQUNsQixLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQywrQkFBK0I7Q0FDdkQsQ0FBQztBQUdGLGtEQUFrRDtBQUVsRCxNQUFNLHNCQUFzQixHQUE2QixDQUFDLEdBQVksRUFBRSxFQUFFO0lBQ3RFLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNwQyxHQUFHLENBQUMsR0FBRyxDQUNILHlCQUF5QixFQUN6QiwySUFBMkksQ0FDOUksQ0FBQTtRQUNELElBQUksRUFBRSxDQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUE7QUFHRCxtQ0FBbUM7QUFDbkMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEdBQVksRUFBRSxFQUFFO0lBQ3hDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxjQUFjLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0Msc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUIsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckMsQ0FBQyxDQUFBO0FBR0QsTUFBTSxHQUFHLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7QUFDdEIsTUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBRWxDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDckMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFFeEIsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFO0lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUNoRCxDQUFDLENBQUMsQ0FBQztBQUNILGtCQUFlLEdBQUcsQ0FBQyJ9