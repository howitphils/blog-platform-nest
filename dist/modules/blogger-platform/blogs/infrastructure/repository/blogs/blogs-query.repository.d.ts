import { PaginatedViewModel } from 'src/core/dto/pagination-view.base';
import { BlogModelType } from '../../../domain/blog.entity';
import { BlogViewDto } from '../../../api/view-dto/blog.view-dto';
import { BlogsQueryParams } from '../../../api/input-dto/get-blogs-query-params.input-dto';
export declare class BlogsQueryRepository {
    private BlogModel;
    constructor(BlogModel: BlogModelType);
    getBlogById(id: string): Promise<BlogViewDto>;
    getBlogs(queryParams: BlogsQueryParams): Promise<PaginatedViewModel<BlogViewDto>>;
}
