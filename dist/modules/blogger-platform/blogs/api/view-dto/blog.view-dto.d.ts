import { BlogDbDocument } from '../../domain/blog.entity';
export declare class BlogViewDto {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
    static mapToView(blog: BlogDbDocument): BlogViewDto;
}
