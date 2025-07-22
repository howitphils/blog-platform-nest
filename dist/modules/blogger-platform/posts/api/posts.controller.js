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
exports.PostsController = void 0;
const posts_query_repository_1 = require("./../infrastructure/posts-query.repository");
const posts_service_1 = require("./../application/posts.service");
const common_1 = require("@nestjs/common");
const posts_query_params_1 = require("./input-dto/posts.query-params");
const create_post_input_dto_1 = require("./input-dto/create-post.input-dto");
const update_post_dto_1 = require("./input-dto/update-post.dto");
let PostsController = class PostsController {
    postsService;
    postsQueryRepository;
    constructor(postsService, postsQueryRepository) {
        this.postsService = postsService;
        this.postsQueryRepository = postsQueryRepository;
    }
    async getPosts(queryParams) {
        const posts = await this.postsQueryRepository.getPosts(queryParams);
        return posts;
    }
    async getPostById(id) {
        const post = await this.postsQueryRepository.getPostById(id);
        return post;
    }
    async createPost(dto) {
        const postId = await this.postsService.createPost({
            blogId: dto.blogId,
            content: dto.content,
            shortDescription: dto.shortDescription,
            title: dto.title,
        });
        const createdPost = await this.postsQueryRepository.getPostById(postId);
        return createdPost;
    }
    async updatePost(id, dto) {
        const updatePostDto = {
            title: dto.title,
            content: dto.content,
            shortDescription: dto.shortDescription,
            blogId: dto.blogId,
        };
        await this.postsService.updatePost(id, updatePostDto);
        return;
    }
    async deletePost(id) {
        await this.postsService.deletePost(id);
        return;
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [posts_query_params_1.PostsQueryParams]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPostById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_input_dto_1.CreatePostInputDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_post_dto_1.UpdatePostInputDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deletePost", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        posts_query_repository_1.PostsQueryRepository])
], PostsController);
//# sourceMappingURL=posts.controller.js.map