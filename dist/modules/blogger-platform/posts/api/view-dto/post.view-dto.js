"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostViewDto = void 0;
const openapi = require("@nestjs/swagger");
var LikeStatuses;
(function (LikeStatuses) {
    LikeStatuses["Like"] = "Like";
    LikeStatuses["Dislike"] = "Dislike";
    LikeStatuses["None"] = "None";
})(LikeStatuses || (LikeStatuses = {}));
class PostViewDto {
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
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, title: { required: true, type: () => String }, shortDescription: { required: true, type: () => String }, content: { required: true, type: () => String }, blogId: { required: true, type: () => String }, blogName: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, extendedLikesInfo: { required: true, type: () => ({ likesCount: { required: true, type: () => Number }, dislikesCount: { required: true, type: () => Number }, myStatus: { required: true, enum: LikeStatuses }, newestLikes: { required: true, type: () => [Object] } }) } };
    }
}
exports.PostViewDto = PostViewDto;
//# sourceMappingURL=post.view-dto.js.map