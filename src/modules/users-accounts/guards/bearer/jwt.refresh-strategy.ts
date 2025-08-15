import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserRefreshRequestDto } from '../dto/user-refresh-request.dto';
import { Request } from 'express';

export const extractRefreshTokenFromCookies = (
  req: Request,
  cookieName: string,
): string | null => {
  const cookies = req.headers.cookie
    ?.split(';')
    .map((c) => c.trim())
    .filter(Boolean);

  if (!cookies?.length) {
    return null;
  }

  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.toLowerCase().startsWith(`${cookieName.toLowerCase()}=`),
  );

  if (!refreshTokenCookie) {
    return null;
  }

  return refreshTokenCookie.slice(cookieName.length + 1);
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    public refreshTokenSecret: string,
    public cookieName: string,
  ) {
    super({
      jwtFromRequest: (req: Request) =>
        extractRefreshTokenFromCookies(req, cookieName),
      secretOrKey: refreshTokenSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: UserRefreshRequestDto) {
    return payload;
  }
}
