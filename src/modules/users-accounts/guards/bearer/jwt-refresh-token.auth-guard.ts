import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest<UserRefreshRequestDto>(
    err: any,
    user: UserRefreshRequestDto,
  ): UserRefreshRequestDto {
    if (err || !user) {
      throw new DomainException(
        'Unauthorized: refresh token issue',
        DomainExceptionCodes.Unauthorized,
      );
    }
    return user;
  }
}
