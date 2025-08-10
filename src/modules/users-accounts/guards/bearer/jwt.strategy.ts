import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRequestDto } from '../dto/user-request.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appConfig } from '../../../../app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig.ACCESS_JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: UserRequestDto) {
    return payload;
  }
}
