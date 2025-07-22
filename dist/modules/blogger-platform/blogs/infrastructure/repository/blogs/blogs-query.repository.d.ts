import { PaginatedViewModel } from 'src/core/dto/base.pagination-view';
import { BlogModelType } from '../../../domain/blog.entity';
import { BlogView } from '../../../api/view-dto/blog.view-dto';
import { BlogsQueryParams } from '../../../api/input-dto/get-blogs-query-params.input-dto';
export declare class BlogsQueryRepository {
    private BlogModel;
    constructor(BlogModel: BlogModelType);
    getBlogById(id: string): Promise<BlogView>;
    getBlogs(queryParams: BlogsQueryParams): Promise<PaginatedViewModel<BlogView>>;
}
