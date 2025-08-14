import { CoreConfig } from './../../../../core/core.config';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { DomainException } from '../../../../core/exceptions/domain-exception';
import { DomainExceptionCodes } from '../../../../core/exceptions/domain-exception.codes';
import { appSettings } from '../../../../app.settings';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private coreConfig: CoreConfig,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      appSettings.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    if (!authHeader || !authHeader.startsWith('Basic')) {
      throw new DomainException(
        'Unauthorized',
        DomainExceptionCodes.Unauthorized,
      );
    }

    const encodedCredentials = Buffer.from(
      this.coreConfig.adminCredentials,
    ).toString('base64');

    const token = authHeader.split(' ')[1];

    if (encodedCredentials !== token) {
      throw new DomainException(
        'Unauthorized',
        DomainExceptionCodes.Unauthorized,
      );
    }

    return true;
  }
}
