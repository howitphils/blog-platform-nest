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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = exports.Post = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Post = class Post {
    title;
    shortDescription;
    content;
    blogId;
    blogName;
    deletedAt;
    dislikesCount;
    likesCount;
    myStatus;
    newestLikes;
    createdAt;
    updatedAt;
    static createPost(dto) {
        const newPost = new this();
        newPost.title = dto.title;
        newPost.content = dto.content;
        newPost.shortDescription = dto.shortDescription;
        newPost.blogId = dto.blogId;
        newPost.blogName = dto.blogName;
        return newPost;
    }
    updatePost(dto) {
        this.content = dto.content;
        this.shortDescription = dto.shortDescription;
        this.title = dto.title;
        this.blogId = dto.blogId;
    }
    deletePost() {
        if (this.deletedAt !== null) {
            throw new Error('Post already deleted');
        }
        this.deletedAt = new Date();
    }
};
exports.Post = Post;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minLength: 1, maxLength: 100 }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minLength: 1, maxLength: 100 }),
    __metadata("design:type", String)
], Post.prototype, "shortDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minLength: 1, maxLength: 1000 }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Post.prototype, "blogId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Post.prototype, "blogName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, nullable: true, default: null }),
    __metadata("design:type", Object)
], Post.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "dislikesCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true, default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "likesCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, default: 'None' }),
    __metadata("design:type", String)
], Post.prototype, "myStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], Post.prototype, "newestLikes", void 0);
exports.Post = Post = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'posts' })
], Post);
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Post);
exports.PostSchema.loadClass(Post);
exports.PostSchema.pre('find', function () {
    this.where({ deletedAt: null });
});
exports.PostSchema.pre('findOne', function () {
    this.where({ deletedAt: null });
});
//# sourceMappingURL=post.entity.js.map