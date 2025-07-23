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
exports.BlogsController = void 0;
const posts_query_repository_1 = require("./../../posts/infrastructure/posts-query.repository");
const posts_service_1 = require("./../../posts/application/posts.service");
const common_1 = require("@nestjs/common");
const get_blogs_query_params_input_dto_1 = require("./input-dto/get-blogs-query-params.input-dto");
const blogs_service_1 = require("../application/blogs-service");
const create_blog_input_dto_1 = require("./input-dto/create-blog.input-dto");
const update_blog_input_dto_1 = require("./input-dto/update-blog.input-dto");
const blogs_query_repository_1 = require("../infrastructure/repository/blogs/blogs-query.repository");
const create_post_for_blog_input_dto_1 = require("../../posts/api/input-dto/create-post-for-blog.input-dto");
const posts_query_params_1 = require("../../posts/api/input-dto/posts.query-params");
let BlogsController = class BlogsController {
    blogsQueryRepository;
    blogsService;
    postsService;
    postsQueryRepository;
    constructor(blogsQueryRepository, blogsService, postsService, postsQueryRepository) {
        this.blogsQueryRepository = blogsQueryRepository;
        this.blogsService = blogsService;
        this.postsService = postsService;
        this.postsQueryRepository = postsQueryRepository;
    }
    async getBlogs(query) {
        return this.blogsQueryRepository.getBlogs(query);
    }
    async getBlogById(id) {
        return this.blogsQueryRepository.getBlogById(id);
    }
    async getPostsForBlog(id, queryParams) {
        return this.postsQueryRepository.getPosts(queryParams, id);
    }
    async createdBlog(dto) {
        const newBlogId = await this.blogsService.createBlog({
            description: dto.description,
            name: dto.name,
            websiteUrl: dto.websiteUrl,
        });
        const blogView = await this.blogsQueryRepository.getBlogById(newBlogId);
        return blogView;
    }
    async createPostForBlog(blogId, dto) {
        const postId = await this.postsService.createPost({
            blogId,
            content: dto.content,
            shortDescription: dto.shortDescription,
            title: dto.title,
        });
        const createdPost = await this.postsQueryRepository.getPostById(postId);
        return createdPost;
    }
    async updateBlog(updatedBlog, id) {
        const updateBlogDto = {
            description: updatedBlog.description,
            name: updatedBlog.name,
            websiteUrl: updatedBlog.websiteUrl,
        };
        await this.blogsService.updateBlog(id, updateBlogDto);
        return;
    }
    async deleteBlog(id) {
        await this.blogsService.deleteBlog(id);
        return;
    }
};
exports.BlogsController = BlogsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_blogs_query_params_input_dto_1.BlogsQueryParams]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getBlogs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getBlogById", null);
__decorate([
    (0, common_1.Get)(':id/posts'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, posts_query_params_1.PostsQueryParams]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getPostsForBlog", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_input_dto_1.CreateBlogInputDto]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "createdBlog", null);
__decorate([
    (0, common_1.Post)(':id/posts'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_post_for_blog_input_dto_1.createPostForBlogInputDto]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "createPostForBlog", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_blog_input_dto_1.UpdateBlogInputDto, String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "updateBlog", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "deleteBlog", null);
exports.BlogsController = BlogsController = __decorate([
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [blogs_query_repository_1.BlogsQueryRepository,
        blogs_service_1.BlogsService,
        posts_service_1.PostsService,
        posts_query_repository_1.PostsQueryRepository])
], BlogsController);
//# sourceMappingURL=blogs.controller.js.map