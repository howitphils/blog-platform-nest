import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt-access') {
  handleRequest<UserAccessRequestDto>(
    err: any,
    user: UserAccessRequestDto,
  ): UserAccessRequestDto {
    if (err || !user) {
      throw new DomainException(
        'Unauthorized',
        DomainExceptionCodes.Unauthorized,
      );
    }
    return user;
  }
}
