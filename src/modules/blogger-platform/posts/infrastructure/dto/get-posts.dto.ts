import { UserAccessRequestDto } from '../../../../users-accounts/guards/dto/user-access-request.dto';
import { PostsQueryParams } from '../../api/input-dto/posts.query-params';

export class GetPostsDto {
  queryParams: PostsQueryParams;
  user: UserAccessRequestDto | null;
  blogId: string | null;
}
