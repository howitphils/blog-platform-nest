export type PaginationMapToViewDtoType<T> = {
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
};
export declare class PaginatedViewModel<T> {
    pagesCount: number;
    pageSize: number;
    totalCount: number;
    page: number;
    items: T[];
    static mapToView<T>(dto: PaginationMapToViewDtoType<T>): PaginatedViewModel<T>;
}
