declare module 'express-swaggerize-ui' {
    export default function swaggerUi(options: {
        route: string;
        docs: any;
    }): any;
}