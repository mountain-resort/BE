import { Prisma } from '@prisma/client';
import { DiningType } from '@prisma/client';
export class WhereCondition {
  isDeleted?: boolean;
  type?: DiningType;
  OR?: Prisma.DiningWhereInput[];
}
