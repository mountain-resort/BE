import { Authority } from '@prisma/client';

export class WhereCondition {
  isDeleted?: boolean;
  authority?:
    | Authority
    | {
        equals: Authority;
        mode: 'insensitive';
      };
  OR?: {
    [key: string]: {
      [key: string]: string;
    };
  }[];
}
