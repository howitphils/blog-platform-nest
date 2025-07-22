export declare class BaseQueryParams {
    pageNumber: number;
    pageSize: number;
    sortDirection: SortDirections;
    calculateSkip(): number;
}
export declare enum SortDirections {
    Asc = "asc",
    Desc = "desc"
}
