"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsQueryParams = void 0;
const base_query_params_1 = require("../../../../../core/dto/base.query-params");
var SortByBlogsOptions;
(function (SortByBlogsOptions) {
    SortByBlogsOptions["CreatedAt"] = "createdAt";
    SortByBlogsOptions["Name"] = "name";
})(SortByBlogsOptions || (SortByBlogsOptions = {}));
class BlogsQueryParams extends base_query_params_1.BaseQueryParams {
    sortBy;
    searchNameTerm;
}
exports.BlogsQueryParams = BlogsQueryParams;
//# sourceMappingURL=get-blogs-query-params.input-dto.js.map