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
exports.TestingAllDataController = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users-accounts/domain/user.entity");
const blog_entity_1 = require("../blogger-platform/blogs/domain/blog.entity");
const http_status_codes_1 = require("../../core/eums/http-status-codes");
let TestingAllDataController = class TestingAllDataController {
    UserModel;
    BlogModel;
    PostModel;
    constructor(UserModel, BlogModel, PostModel) {
        this.UserModel = UserModel;
        this.BlogModel = BlogModel;
        this.PostModel = PostModel;
    }
    async removeAllData() {
        await this.UserModel.deleteMany({});
        await this.BlogModel.deleteMany({});
        await this.PostModel.deleteMany({});
    }
};
exports.TestingAllDataController = TestingAllDataController;
__decorate([
    (0, common_1.Delete)('all-data'),
    (0, common_1.HttpCode)(http_status_codes_1.HttpStatusCodes.No_Content),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestingAllDataController.prototype, "removeAllData", null);
exports.TestingAllDataController = TestingAllDataController = __decorate([
    (0, common_1.Controller)('testing'),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(blog_entity_1.Blog.name)),
    __param(2, (0, mongoose_1.InjectModel)(common_1.Post.name)),
    __metadata("design:paramtypes", [Object, Object, Object])
], TestingAllDataController);
//# sourceMappingURL=testing.controller.js.map