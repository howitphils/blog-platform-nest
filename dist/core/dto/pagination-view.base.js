"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedViewModel = void 0;
const openapi = require("@nestjs/swagger");
class PaginatedViewModel {
    pagesCount;
    pageSize;
    totalCount;
    page;
    items;
    static mapToView(dto) {
        return {
            page: dto.page,
            pagesCount: Math.ceil(dto.totalCount / dto.pageSize),
            pageSize: dto.pageSize,
            totalCount: dto.totalCount,
            items: dto.items,
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { pagesCount: { required: true, type: () => Number }, pageSize: { required: true, type: () => Number }, totalCount: { required: true, type: () => Number }, page: { required: true, type: () => Number }, items: { required: true } };
    }
}
exports.PaginatedViewModel = PaginatedViewModel;
//# sourceMappingURL=pagination-view.base.js.map