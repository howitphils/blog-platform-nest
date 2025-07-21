export type PaginationMapToViewDtoType<T> = {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export class PaginationView<T> {
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  page: number;
  items: T[];

  static mapToView<T>(dto: PaginationMapToViewDtoType<T>): PaginationView<T> {
    return {
      page: dto.page,
      pagesCount: Math.ceil(dto.totalCount / dto.pageSize),
      pageSize: dto.pageSize,
      totalCount: dto.totalCount,
      items: dto.items,
    };
  }
}
