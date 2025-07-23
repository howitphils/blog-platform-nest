"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostView = void 0;
var LikeStatuses;
(function (LikeStatuses) {
    LikeStatuses["Like"] = "Like";
    LikeStatuses["Dislike"] = "Dislike";
    LikeStatuses["None"] = "None";
})(LikeStatuses || (LikeStatuses = {}));
class PostView {
    id;
    title;
    shortDescription;
    content;
    blogId;
    blogName;
    createdAt;
    extendedLikesInfo;
    static mapToView(dto) {
        return {
            id: dto._id.toString(),
            blogId: dto.blogId,
            blogName: dto.blogName,
            content: dto.content,
            createdAt: dto.createdAt,
            shortDescription: dto.shortDescription,
            title: dto.title,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatuses.None,
                newestLikes: [],
            },
        };
    }
}
exports.PostView = PostView;
//# sourceMappingURL=post.view-dto.js.map