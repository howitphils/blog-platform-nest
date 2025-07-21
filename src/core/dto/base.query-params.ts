import { Type } from 'class-transformer/types/decorators/type.decorator';

export class BaseQueryPaginationParams {
  @Type(() => Number)
  pageNumber: number = 1;
  @Type(() => Number)
  pageSize: number = 10;
  sortDirection: SortDirections = SortDirections.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export enum SortDirections {
  Asc = 'asc',
  Desc = 'desc',
}
