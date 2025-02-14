import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { MembersService } from 'src/members/members.service';
import * as jwt from 'jsonwebtoken';
import { env } from '../configs/env';
import { TokenPayloadDto } from '../dto/tokenPayload';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private readonly membersService: MembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refresh_token'];

    // 리프레시 토큰이 없으면 예외 발생
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token not found');
    }

    // 리프레시 토큰 디코딩
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      env.JWT_SECRET,
    ) as TokenPayloadDto;

    // 리프레시 토큰 검증
    const user = await this.membersService.checkRefreshToken(
      decodedRefreshToken.id,
      refreshToken.refreshToken,
    );

    // 리프레시 토큰이 유효하지 않으면 예외 발생
    if (!user) {
      throw new ForbiddenException('Invalid refresh token');
    }

    // request에 user 정보를 추가할 수 있습니다
    request.user = user;

    return true;
  }
}
