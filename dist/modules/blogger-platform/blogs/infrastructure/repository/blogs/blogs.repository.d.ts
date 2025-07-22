import { BlogDbDocument, BlogModelType } from '../../../domain/blog.entity';
export declare class BlogsRepository {
    private BlogModel;
    constructor(BlogModel: BlogModelType);
    save(blog: BlogDbDocument): Promise<string>;
    getById(id: string): Promise<BlogDbDocument>;
}
