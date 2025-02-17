import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { env } from 'src/common/configs/env';
import { TokenPayloadDto } from '../../common/dto/tokenPayload';
import { MembersService } from 'src/members/members.service';
interface JwtRefreshPayload extends TokenPayloadDto {
  refreshToken: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly membersService: MembersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const data = req?.cookies['refresh_token'];
          return data || null; // null을 반환하면 401
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: JwtRefreshPayload) {
    return payload;
  }
}
