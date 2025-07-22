"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_query_repository_1 = require("./../infrastructure/users-query.repository");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../application/users.service");
const create_users_input_dto_1 = require("./input-dto/create-users.input-dto");
const get_users_query_params_input_1 = require("./input-dto/get-users-query-params.input");
let UsersController = class UsersController {
    usersService;
    usersQueryRepository;
    constructor(usersService, usersQueryRepository) {
        this.usersService = usersService;
        this.usersQueryRepository = usersQueryRepository;
    }
    async getUsers(query) {
        return this.usersQueryRepository.getUsers(query);
    }
    async createUser(body) {
        return this.usersService.createUser({
            email: body.email,
            login: body.login,
            password: body.password,
        });
    }
    async deleteUser(id) {
        return this.usersService.deleteUser(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_users_query_params_input_1.GetUsersQueryParams]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_users_input_dto_1.CreateUserInputDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        users_query_repository_1.UsersQueryRepository])
], UsersController);
//# sourceMappingURL=users.controller.js.map