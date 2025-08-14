import { UserAccessRequestDto } from '../../../../users-accounts/guards/dto/user-access-request.dto';

export class GetPostDto {
  postId: string;
  user: UserAccessRequestDto | null;
}
