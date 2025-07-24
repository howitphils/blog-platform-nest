"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostForBlogInputDto = void 0;
const openapi = require("@nestjs/swagger");
class createPostForBlogInputDto {
    title;
    shortDescription;
    content;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, shortDescription: { required: true, type: () => String }, content: { required: true, type: () => String } };
    }
}
exports.createPostForBlogInputDto = createPostForBlogInputDto;
//# sourceMappingURL=create-post-for-blog.input-dto.js.map