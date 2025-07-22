"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedViewModel = void 0;
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
}
exports.PaginatedViewModel = PaginatedViewModel;
//# sourceMappingURL=base.pagination-view.js.map