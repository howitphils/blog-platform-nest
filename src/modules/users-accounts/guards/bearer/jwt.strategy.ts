import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserContextDto } from '../dto/user-context.dto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { appConfig } from '../../../../app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: UserContextDto) {
    return payload;
  }
}
