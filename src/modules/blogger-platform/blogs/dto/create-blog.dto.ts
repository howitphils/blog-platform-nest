import { CreateBlogInputDto } from '../api/input-dto/create-blog.input-dto';

export class CreateBlogDto implements CreateBlogInputDto {
  name: string;
  description: string;
  websiteUrl: string;
}
