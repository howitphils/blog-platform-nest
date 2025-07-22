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
exports.BlogSchema = exports.Blog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Blog = class Blog {
    name;
    description;
    websiteUrl;
    isMembership;
    deletedAt;
    createdAt;
    updatedAt;
    static createBlog(dto) {
        const newBlog = new this();
        newBlog.name = dto.name;
        newBlog.description = dto.description;
        newBlog.websiteUrl = dto.websiteUrl;
        newBlog.isMembership = false;
        return newBlog;
    }
    updateBlog(dto) {
        this.description = dto.description;
        this.name = dto.name;
        this.websiteUrl = dto.websiteUrl;
    }
    deleteBlog() {
        if (this.deletedAt !== null) {
            throw new Error('Blog is alredy deleted');
        }
        this.deletedAt = new Date();
    }
};
exports.Blog = Blog;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minlength: 1, maxlength: 50 }),
    __metadata("design:type", String)
], Blog.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minlength: 1, maxlength: 150 }),
    __metadata("design:type", String)
], Blog.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minlength: 1, maxlength: 150 }),
    __metadata("design:type", String)
], Blog.prototype, "websiteUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: true }),
    __metadata("design:type", Boolean)
], Blog.prototype, "isMembership", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, nullable: true, default: null }),
    __metadata("design:type", Date)
], Blog.prototype, "deletedAt", void 0);
exports.Blog = Blog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'blogs' })
], Blog);
exports.BlogSchema = mongoose_1.SchemaFactory.createForClass(Blog);
exports.BlogSchema.loadClass(Blog);
exports.BlogSchema.pre('find', function () {
    this.where({ deletedAt: null });
});
exports.BlogSchema.pre('findOne', function () {
    this.where({ deletedAt: null });
});
//# sourceMappingURL=blog.entity.js.map