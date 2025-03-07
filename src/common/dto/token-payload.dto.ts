export class TokenPayloadDto {
  id: number;
  email: string;
  authority?: 'NORMAL' | 'MANAGER';
}
