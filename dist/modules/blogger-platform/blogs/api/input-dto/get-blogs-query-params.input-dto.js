"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsQueryParams = void 0;
const openapi = require("@nestjs/swagger");
const query_params_base_1 = require("../../../../../core/dto/query-params.base");
var SortByBlogsOptions;
(function (SortByBlogsOptions) {
    SortByBlogsOptions["CreatedAt"] = "createdAt";
    SortByBlogsOptions["Name"] = "name";
})(SortByBlogsOptions || (SortByBlogsOptions = {}));
class BlogsQueryParams extends query_params_base_1.BaseQueryParams {
    sortBy = SortByBlogsOptions.CreatedAt;
    searchNameTerm;
    static _OPENAPI_METADATA_FACTORY() {
        return { sortBy: { required: true, default: SortByBlogsOptions.CreatedAt, enum: SortByBlogsOptions }, searchNameTerm: { required: true, type: () => String, nullable: true } };
    }
}
exports.BlogsQueryParams = BlogsQueryParams;
//# sourceMappingURL=get-blogs-query-params.input-dto.js.map