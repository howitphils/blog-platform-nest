"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appSetup = appSetup;
const app_pipes_setup_1 = require("./app.pipes-setup");
const app_swagger_setup_1 = require("./app.swagger-setup");
function appSetup(app) {
    app.enableCors();
    (0, app_pipes_setup_1.pipesSetup)(app);
    (0, app_swagger_setup_1.swaggerSetup)(app);
}
//# sourceMappingURL=app.setup.js.map