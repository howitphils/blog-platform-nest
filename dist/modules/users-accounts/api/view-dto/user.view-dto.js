"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserViewDto = void 0;
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
}
exports.UserViewDto = UserViewDto;
//# sourceMappingURL=user.view-dto.js.map