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
exports.PostsQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const post_view_dto_1 = require("../api/view-dto/post.view-dto");
const base_pagination_view_1 = require("../../../../core/dto/base.pagination-view");
let PostsQueryRepository = class PostsQueryRepository {
    PostModel;
    constructor(PostModel) {
        this.PostModel = PostModel;
    }
    async getPostById(id) {
        const post = await this.PostModel.findById(id);
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return post_view_dto_1.PostView.mapToView(post);
    }
    async getPosts(queryParams, blogId) {
        const { pageNumber, pageSize, sortBy, sortDirection } = queryParams;
        const filter = blogId ? { blogId } : {};
        const posts = await this.PostModel.find(filter)
            .sort({
            [sortBy]: sortDirection,
        })
            .skip(queryParams.calculateSkip())
            .limit(pageSize);
        const totalCount = await this.PostModel.countDocuments(filter);
        return base_pagination_view_1.PaginatedViewModel.mapToView({
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map((post) => post_view_dto_1.PostView.mapToView(post)),
        });
    }
};
exports.PostsQueryRepository = PostsQueryRepository;
exports.PostsQueryRepository = PostsQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(common_1.Post.name)),
    __metadata("design:paramtypes", [Object])
], PostsQueryRepository);
//# sourceMappingURL=posts-query.repository.js.map