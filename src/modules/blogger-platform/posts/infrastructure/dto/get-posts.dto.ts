import { UserRequestDto } from '../../../../users-accounts/guards/dto/user-request.dto';
import { PostsQueryParams } from '../../api/input-dto/posts.query-params';

export class GetPostsDto {
  queryParams: PostsQueryParams;
  user: UserRequestDto | null;
  blogId: string | null;
}
