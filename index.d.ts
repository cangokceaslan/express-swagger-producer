import { Express } from 'express';
declare module 'express-swagger-producer' {
    function SwaggerGenerator(options: any): any;
    export default function ExpressSwagger(app: Express): typeof SwaggerGenerator;
}