import { UserRefreshRequestDto } from './modules/users-accounts/guards/dto/user-refresh-request.dto';
import { Request } from 'express';
import { UserAccessRequestDto } from './modules/users-accounts/guards/dto/user-access-request.dto';

declare global {
  interface RequestWithAccessUser extends Request {
    user: UserAccessRequestDto;
  }
}

declare global {
  interface RequestWithRefreshUser extends Request {
    user: UserRefreshRequestDto;
  }
}

declare global {
  interface RequestWithOptionalUser extends Request {
    user: UserAccessRequestDto | null;
  }
}
