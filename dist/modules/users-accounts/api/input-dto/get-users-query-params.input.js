"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersQueryParams = exports.UsersSortByOptions = void 0;
const query_params_base_1 = require("../../../../core/dto/query-params.base");
var UsersSortByOptions;
(function (UsersSortByOptions) {
    UsersSortByOptions["CreatedAt"] = "createdAt";
    UsersSortByOptions["Login"] = "login";
    UsersSortByOptions["Email"] = "email";
})(UsersSortByOptions || (exports.UsersSortByOptions = UsersSortByOptions = {}));
class GetUsersQueryParams extends query_params_base_1.BaseQueryParams {
    sortBy = UsersSortByOptions.CreatedAt;
    searchLoginTerm;
    searchEmailTerm;
}
exports.GetUsersQueryParams = GetUsersQueryParams;
//# sourceMappingURL=get-users-query-params.input.js.map