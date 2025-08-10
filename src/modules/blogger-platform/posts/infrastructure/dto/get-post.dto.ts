import { UserRequestDto } from '../../../../users-accounts/guards/dto/user-request.dto';

export class GetPostDto {
  postId: string;
  user: UserRequestDto | null;
}
