"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostView = void 0;
class PostView {
    id;
    title;
    shortDescription;
    content;
    blogId;
    blogName;
    createdAt;
    static mapToView(dto) {
        return {
            id: dto._id.toString(),
            blogId: dto.blogId,
            blogName: dto.blogName,
            content: dto.content,
            createdAt: dto.createdAt,
            shortDescription: dto.shortDescription,
            title: dto.title,
        };
    }
}
exports.PostView = PostView;
//# sourceMappingURL=post.view-dto.js.map