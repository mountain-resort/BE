import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { env } from 'src/common/configs/env';
import { TokenPayloadDto } from '../../common/dto/token-payload.dto';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const data = req?.cookies['access_token'];
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (!payload.authority) {
      throw new UnauthorizedException('Invalid token payload authority');
    }

    const user: TokenPayloadDto = {
      id: payload.id,
      email: payload.email,
      authority: payload.authority,
    };

    return user;
  }
}
