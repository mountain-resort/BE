import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalGuard extends AuthGuard('optional') {
  handleRequest(err: any, user: any, info: any) {
    return user; // 인증 실패하더라도 에러를 발생시키지 않고 user를 반환 (없으면 null)
  }
}
