export class WhereCondition {
  isDeleted?: boolean | null;
  OR?: Array<{ [key: string]: { [key: string]: string } }>;
}
