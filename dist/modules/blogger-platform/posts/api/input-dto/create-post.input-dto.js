"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostInputDto = void 0;
const openapi = require("@nestjs/swagger");
class CreatePostInputDto {
    title;
    shortDescription;
    content;
    blogId;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, shortDescription: { required: true, type: () => String }, content: { required: true, type: () => String }, blogId: { required: true, type: () => String } };
    }
}
exports.CreatePostInputDto = CreatePostInputDto;
//# sourceMappingURL=create-post.input-dto.js.map