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
exports.UsersQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_entity_1 = require("../domain/user.entity");
const base_pagination_view_1 = require("../../../core/dto/base.pagination-view");
const user_view_dto_1 = require("../api/view-dto/user.view-dto");
let UsersQueryRepository = class UsersQueryRepository {
    UserModel;
    constructor(UserModel) {
        this.UserModel = UserModel;
    }
    async getUsers(queryParams) {
        const { pageNumber, pageSize, searchEmailTerm, searchLoginTerm, sortBy, sortDirection, } = queryParams;
        const createFilter = () => {
            if (searchEmailTerm && searchLoginTerm) {
                return {
                    $or: [
                        {
                            email: { $regex: searchEmailTerm, $options: 'i' },
                        },
                        {
                            login: { $regex: searchLoginTerm, $options: 'i' },
                        },
                    ],
                };
            }
            else if (searchEmailTerm) {
                return { email: { $regex: searchEmailTerm, $options: 'i' } };
            }
            else if (searchLoginTerm) {
                return { login: { $regex: searchLoginTerm, $options: 'i' } };
            }
            else {
                return {};
            }
        };
        const users = await this.UserModel.find(createFilter())
            .sort({
            [sortBy]: sortDirection,
        })
            .skip(queryParams.calculateSkip())
            .limit(pageSize);
        const totalCount = await this.UserModel.countDocuments(createFilter());
        return base_pagination_view_1.PaginatedViewModel.mapToView({
            totalCount,
            pageSize,
            page: pageNumber,
            items: users.map((user) => user_view_dto_1.UserViewDto.mapToView(user)),
        });
    }
};
exports.UsersQueryRepository = UsersQueryRepository;
exports.UsersQueryRepository = UsersQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [Object])
], UsersQueryRepository);
//# sourceMappingURL=users-query.repository.js.map