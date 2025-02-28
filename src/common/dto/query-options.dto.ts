import { IsNumber, IsOptional } from 'class-validator';

export class QueryOptions {
  @IsOptional()
  where?: any;

  @IsOptional()
  orderBy?: any;

  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsNumber()
  take?: number;

  @IsOptional()
  cursor?: { id: number };
}
