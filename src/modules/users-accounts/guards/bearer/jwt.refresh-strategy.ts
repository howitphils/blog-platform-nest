import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserRefreshRequestDto } from '../dto/user-refresh-request.dto';
import { Request } from 'express';

export const extractRefreshTokenFromCookies = (req: Request): string | null => {
  const cookies = req.headers.cookie?.split('; ');
  if (!cookies?.length) {
    return null;
  }

  const refreshTokenCookie = cookies.find(
    (cookie) => cookie.startsWith('refreshToken='), // Assuming your refresh token cookie is named 'refreshToken'
  );

  if (!refreshTokenCookie) {
    return null;
  }

  return refreshTokenCookie.split('=')[1];
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(public refreshTokenSecret: string) {
    super({
      jwtFromRequest: extractRefreshTokenFromCookies,
      secretOrKey: refreshTokenSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: UserRefreshRequestDto) {
    return payload;
  }
}
