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
exports.PostsService = void 0;
const blogs_repository_1 = require("./../../blogs/infrastructure/repository/blogs/blogs.repository");
const mongoose_1 = require("@nestjs/mongoose");
const posts_repository_1 = require("./../infrastructure/posts.repository");
const common_1 = require("@nestjs/common");
let PostsService = class PostsService {
    PostModel;
    postsRepository;
    blogsRepository;
    constructor(PostModel, postsRepository, blogsRepository) {
        this.PostModel = PostModel;
        this.postsRepository = postsRepository;
        this.blogsRepository = blogsRepository;
    }
    async createPost(dto) {
        const blog = await this.blogsRepository.getById(dto.blogId);
        const newPost = this.PostModel.createPost({
            blogId: dto.blogId,
            content: dto.content,
            shortDescription: dto.shortDescription,
            title: dto.title,
            blogName: blog.name,
        });
        const createdId = await this.postsRepository.save(newPost);
        return createdId;
    }
    async updatePost(id, dto) {
        await this.blogsRepository.getById(dto.blogId);
        const targetPost = await this.postsRepository.getPostById(id);
        targetPost.updatePost(dto);
        await this.postsRepository.save(targetPost);
        return;
    }
    async deletePost(id) {
        const targetPost = await this.postsRepository.getPostById(id);
        targetPost.deletePost();
        await this.postsRepository.save(targetPost);
        return;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(common_1.Post.name)),
    __metadata("design:paramtypes", [Object, posts_repository_1.PostsRepository,
        blogs_repository_1.BlogsRepository])
], PostsService);
//# sourceMappingURL=posts.service.js.map