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
exports.BlogsService = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const blog_entity_1 = require("../domain/blog.entity");
const blogs_repository_1 = require("../infrastructure/repository/blogs/blogs.repository");
let BlogsService = class BlogsService {
    BlogModel;
    blogsRepository;
    constructor(BlogModel, blogsRepository) {
        this.BlogModel = BlogModel;
        this.blogsRepository = blogsRepository;
    }
    async createBlog(dto) {
        const newBlog = this.BlogModel.createBlog(dto);
        const createdId = await this.blogsRepository.save(newBlog);
        return createdId;
    }
    async createPostForBlog(dto) {
        await this.blogsRepository.getById(dto.blogId);
    }
    async updateBlog(id, dto) {
        const targetBlog = await this.blogsRepository.getById(id);
        targetBlog.updateBlog({
            description: dto.description,
            name: dto.name,
            websiteUrl: dto.websiteUrl,
        });
        await this.blogsRepository.save(targetBlog);
        return;
    }
    async deleteBlog(id) {
        const targetBlog = await this.blogsRepository.getById(id);
        targetBlog.deleteBlog();
        await this.blogsRepository.save(targetBlog);
        return;
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blog_entity_1.Blog.name)),
    __metadata("design:paramtypes", [Object, blogs_repository_1.BlogsRepository])
], BlogsService);
//# sourceMappingURL=blogs-service.js.map