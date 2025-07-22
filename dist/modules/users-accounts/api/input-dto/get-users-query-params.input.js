"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersQueryParams = exports.UsersSortByOptions = void 0;
const base_query_params_1 = require("../../../../core/dto/base.query-params");
var UsersSortByOptions;
(function (UsersSortByOptions) {
    UsersSortByOptions["CreatedAt"] = "createdAt";
})(UsersSortByOptions || (exports.UsersSortByOptions = UsersSortByOptions = {}));
class GetUsersQueryParams extends base_query_params_1.BaseQueryParams {
    sortBy;
    searchLoginTerm;
    searchEmailTerm;
}
exports.GetUsersQueryParams = GetUsersQueryParams;
//# sourceMappingURL=get-users-query-params.input.js.map