import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserAccessRequestDto } from '../dto/user-access-request.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(public accessTokenSecret: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: UserAccessRequestDto) {
    return payload;
  }
}
