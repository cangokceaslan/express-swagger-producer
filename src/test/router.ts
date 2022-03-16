import express, { Response, Router, NextFunction, Express } from 'express';
import ExpressSwagger from '@app';


//Express Swagger Generator

/* EXPRESS SWAGGER OPTIONS */
const swaggerOptions: object = {
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
    basedir: __dirname, //app absolute path
    files: ['./**/*.ts'] //Path to the API handle folder
};


//SWAGGER DATA LOAD ENABLER MIDDLEWARE FOR BROWSER

const EnableSwaggerOnBrowser: { (app: Express): void } = (app: Express) => {
    app.get("/api-docs", (req, res, next) => {
        res.set(
            "Content-Security-Policy",
            "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'; img-src 'self' data:;"
        )
        next();
    })
}


/* EXPRESS SWAGGER CONFIGURATION */
const SwaggerDocsCreator = (app: Express) => {
    const ExpressSwaggerFn = ExpressSwagger(app);
    EnableSwaggerOnBrowser(app);
    ExpressSwaggerFn(swaggerOptions);
}


const app = express();
const router = express.Router();
router.post("/", function () { });

router.get('/test', function () { });
app.use("/api", router);

SwaggerDocsCreator(app);

app.listen(80, () => {
    console.log("Server is running on port 80");
});
export default app;
