export class OrderByQueryDto {
  orderBy:
    | {
        [key: string]: string;
      }
    | {
        [key: string]: {
          [key: string]: string;
        };
      };
}
