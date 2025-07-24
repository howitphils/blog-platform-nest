"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSetup = swaggerSetup;
const swagger_1 = require("@nestjs/swagger");
function swaggerSetup(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Bloggers Platform')
        .setDescription('Bloggers platform api description')
        .setVersion('1.0')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, documentFactory);
}
//# sourceMappingURL=app.swagger-setup.js.map