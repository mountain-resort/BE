import { JwtService } from '@nestjs/jwt';

interface CreateTokenPayload {
  id: number;
  email: string;
}

export default function createMemberToken(
  payload: CreateTokenPayload,
  type: 'access' | 'refresh',
) {
  const jwtPayload = {
    id: payload.id,
    email: payload.email,
  };

  const jwtService = new JwtService();
  const expiresIn = type === 'access' ? '1h' : '7d';
  const secret = process.env.JWT_SECRET;

  return jwtService.sign(jwtPayload, { secret, expiresIn });
}
