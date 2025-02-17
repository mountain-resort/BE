import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { env } from 'src/common/configs/env';
import { TokenPayloadDto } from '../../common/dto/tokenPayload';

@Injectable()
export class JwtOptionalStrategy extends PassportStrategy(
  Strategy,
  'optional',
) {
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

  async validate(payload: TokenPayloadDto | null) {
    return payload ? payload : null;
  }
}
