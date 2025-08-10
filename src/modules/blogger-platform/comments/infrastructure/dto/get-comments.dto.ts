import { UserRequestDto } from '../../../../users-accounts/guards/dto/user-request.dto';
import { CommentsQueryParams } from '../../api/input-dto/get-comments.query-params';

export class GetCommentsDto {
  public query: CommentsQueryParams;
  public postId: string;
  public user: UserRequestDto | null;
}
