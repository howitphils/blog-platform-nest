import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryParams } from 'src/core/dto/query-params.base';

enum SortByBlogsOptions {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export class BlogsQueryParams extends BaseQueryParams {
  @IsEnum(SortByBlogsOptions)
  sortBy: SortByBlogsOptions = SortByBlogsOptions.CreatedAt;

  @IsString()
  @IsOptional()
  searchNameTerm: string | null;
}
