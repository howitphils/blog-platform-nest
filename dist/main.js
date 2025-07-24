"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const app_config_1 = require("./app.config");
const app_setup_1 = require("./setup/app.setup");
const fs_1 = require("fs");
const http_1 = require("http");
const serverUrl = 'http://localhost:5003';
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    (0, app_setup_1.appSetup)(app);
    await app.listen(app_config_1.appConfig.PORT);
    if (process.env.NODE_ENV === 'development') {
        (0, http_1.get)(`${serverUrl}/api-docs/swagger-ui-bundle.js`, function (response) {
            response.pipe((0, fs_1.createWriteStream)('swagger-static/swagger-ui-bundle.js'));
        });
        (0, http_1.get)(`${serverUrl}/api-docs/swagger-ui-init.js`, function (response) {
            response.pipe((0, fs_1.createWriteStream)('swagger-static/swagger-ui-init.js'));
        });
        (0, http_1.get)(`${serverUrl}/api-docs/swagger-ui-standalone-preset.js`, function (response) {
            response.pipe((0, fs_1.createWriteStream)('swagger-static/swagger-ui-standalone-preset.js'));
        });
        (0, http_1.get)(`${serverUrl}/api-docs/swagger-ui.css`, function (response) {
            response.pipe((0, fs_1.createWriteStream)('swagger-static/swagger-ui.css'));
        });
    }
}
void bootstrap();
//# sourceMappingURL=main.js.map