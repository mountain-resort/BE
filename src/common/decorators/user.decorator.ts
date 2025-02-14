import { createParamDecorator } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // 요청 객체 가져오기
    const user = request.user; // 요청 객체에서 user 속성 가져오기
    return data ? user?.[data] : user; // 데코레이터에 전달된 데이터가 있으면 해당 데이터 반환, 없으면 전체 user 객체 반환
  },
);
