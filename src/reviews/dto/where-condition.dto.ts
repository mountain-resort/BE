export class WhereConditionDto {
  accommodationId: number;
  isBest: boolean;
  OR: {
    [key: string]: {
      contains: string;
    };
  }[];
}
