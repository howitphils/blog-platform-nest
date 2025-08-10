import { Request } from 'express';
import { UserRequestDto } from './modules/users-accounts/guards/dto/user-request.dto';

declare global {
  interface RequestWithUser extends Request {
    user: UserRequestDto;
  }
}

declare global {
  interface RequestWithOptionalUser extends Request {
    user: UserRequestDto | null;
  }
}
