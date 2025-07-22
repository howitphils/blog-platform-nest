"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogView = void 0;
class BlogView {
    id;
    name;
    description;
    websiteUrl;
    createdAt;
    isMembership;
    static mapToView(blog) {
        return {
            id: blog._id.toString(),
            description: blog.description,
            isMembership: blog.isMembership,
            name: blog.name,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
        };
    }
}
exports.BlogView = BlogView;
//# sourceMappingURL=blog.view-dto.js.map