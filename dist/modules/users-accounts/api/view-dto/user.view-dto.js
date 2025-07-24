"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserViewDto = void 0;
const openapi = require("@nestjs/swagger");
class UserViewDto {
    id;
    email;
    login;
    createdAt;
    static mapToView(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, email: { required: true, type: () => String }, login: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
}
exports.UserViewDto = UserViewDto;
//# sourceMappingURL=user.view-dto.js.map