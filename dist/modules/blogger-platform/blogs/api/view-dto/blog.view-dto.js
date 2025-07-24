"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogViewDto = void 0;
const openapi = require("@nestjs/swagger");
class BlogViewDto {
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
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: true, type: () => String }, websiteUrl: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, isMembership: { required: true, type: () => Boolean } };
    }
}
exports.BlogViewDto = BlogViewDto;
//# sourceMappingURL=blog.view-dto.js.map