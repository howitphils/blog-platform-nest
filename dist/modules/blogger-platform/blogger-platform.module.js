"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloggersPlatformModule = void 0;
const common_1 = require("@nestjs/common");
const blogs_controller_1 = require("./blogs/api/blogs.controller");
const mongoose_1 = require("@nestjs/mongoose");
const blog_entity_1 = require("./blogs/domain/blog.entity");
const blogs_service_1 = require("./blogs/application/blogs-service");
const blogs_repository_1 = require("./blogs/infrastructure/repository/blogs/blogs.repository");
const blogs_query_repository_1 = require("./blogs/infrastructure/repository/blogs/blogs-query.repository");
const post_entity_1 = require("./posts/domain/post.entity");
const posts_repository_1 = require("./posts/infrastructure/posts.repository");
const posts_query_repository_1 = require("./posts/infrastructure/posts-query.repository");
const posts_service_1 = require("./posts/application/posts.service");
const posts_controller_1 = require("./posts/api/posts.controller");
let BloggersPlatformModule = class BloggersPlatformModule {
};
exports.BloggersPlatformModule = BloggersPlatformModule;
exports.BloggersPlatformModule = BloggersPlatformModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: blog_entity_1.Blog.name, schema: blog_entity_1.BlogSchema },
                { name: common_1.Post.name, schema: post_entity_1.PostSchema },
            ]),
        ],
        controllers: [blogs_controller_1.BlogsController, posts_controller_1.PostsController],
        providers: [
            blogs_repository_1.BlogsRepository,
            blogs_query_repository_1.BlogsQueryRepository,
            blogs_service_1.BlogsService,
            posts_repository_1.PostsRepository,
            posts_query_repository_1.PostsQueryRepository,
            posts_service_1.PostsService,
        ],
        exports: [],
    })
], BloggersPlatformModule);
//# sourceMappingURL=blogger-platform.module.js.map