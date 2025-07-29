import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from 'src/core/exceptions/domain-exception';
import { DomainExceptionCodes } from 'src/core/exceptions/domain-exception.codes';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<UserContextDto>(
    err: any,
    user: UserContextDto,
  ): UserContextDto {
    if (err || !user) {
      throw new DomainException(
        'Unauthorized',
        DomainExceptionCodes.Unauthorized,
      );
    }
    return user;
  }
}
