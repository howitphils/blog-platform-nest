import { CommentsQueryParams } from '../../../api/input-dto/get-comments.query-params';

export class GetCommentsDto {
  public query: CommentsQueryParams;
  public postId: string;
  public userId: string | null;
}
