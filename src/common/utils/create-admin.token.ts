import { JwtService } from '@nestjs/jwt';

interface CreateTokenPayload {
  id: number;
  email: string;
  authority: string;
}

export default function createAdminToken(
  payload: CreateTokenPayload,
  type: 'access' | 'refresh',
) {
  const jwtPayload = {
    id: payload.id,
    email: payload.email,
    authority: payload.authority, // 관리자 권한 추가 -> 추후 권한으로 백엔드에서 요청 반환
  };

  const jwtService = new JwtService();
  const expiresIn = type === 'access' ? '1h' : '7d';
  const secret = process.env.JWT_SECRET;

  return jwtService.sign(jwtPayload, { secret, expiresIn });
}
