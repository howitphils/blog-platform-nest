"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsQueryParams = void 0;
const base_query_params_1 = require("../../../../../core/dto/base.query-params");
var PostsSortByOptions;
(function (PostsSortByOptions) {
    PostsSortByOptions["CreatedAt"] = "createdAt";
})(PostsSortByOptions || (PostsSortByOptions = {}));
class PostsQueryParams extends base_query_params_1.BaseQueryParams {
    sortBy = PostsSortByOptions.CreatedAt;
}
exports.PostsQueryParams = PostsQueryParams;
//# sourceMappingURL=posts.query-params.js.map