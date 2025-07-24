"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsQueryParams = void 0;
const query_params_base_1 = require("../../../../../core/dto/query-params.base");
var PostsSortByOptions;
(function (PostsSortByOptions) {
    PostsSortByOptions["CreatedAt"] = "createdAt";
})(PostsSortByOptions || (PostsSortByOptions = {}));
class PostsQueryParams extends query_params_base_1.BaseQueryParams {
    sortBy = PostsSortByOptions.CreatedAt;
}
exports.PostsQueryParams = PostsQueryParams;
//# sourceMappingURL=posts.query-params.js.map