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
exports.BlogsQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const base_pagination_view_1 = require("../../../../../../core/dto/base.pagination-view");
const blog_entity_1 = require("../../../domain/blog.entity");
const blog_view_dto_1 = require("../../../api/view-dto/blog.view-dto");
const mongoose_2 = require("mongoose");
let BlogsQueryRepository = class BlogsQueryRepository {
    BlogModel;
    constructor(BlogModel) {
        this.BlogModel = BlogModel;
    }
    async getBlogById(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.NotFoundException('Invalid blog id');
        }
        const blog = await this.BlogModel.findById(id);
        if (!blog) {
            throw new common_1.NotFoundException('Blog was not found');
        }
        return blog_view_dto_1.BlogView.mapToView(blog);
    }
    async getBlogs(queryParams) {
        const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = queryParams;
        const filter = searchNameTerm
            ? {
                name: { $regex: searchNameTerm, $options: 'i' },
            }
            : {};
        const blogs = await this.BlogModel.find(filter)
            .sort({
            [sortBy]: sortDirection,
        })
            .skip(queryParams.calculateSkip())
            .limit(pageSize)
            .lean();
        const totalCount = await this.BlogModel.countDocuments(filter);
        return base_pagination_view_1.PaginatedViewModel.mapToView({
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map((blog) => blog_view_dto_1.BlogView.mapToView(blog)),
        });
    }
};
exports.BlogsQueryRepository = BlogsQueryRepository;
exports.BlogsQueryRepository = BlogsQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blog_entity_1.Blog.name)),
    __metadata("design:paramtypes", [Object])
], BlogsQueryRepository);
//# sourceMappingURL=blogs-query.repository.js.map