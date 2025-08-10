import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthOptionalGuard extends AuthGuard('jwt') {
  handleRequest<UserContextDto>(
    err: any,
    user: UserContextDto,
  ): UserContextDto | null {
    if (err || !user) {
      return null;
    }

    return user;
  }
}
