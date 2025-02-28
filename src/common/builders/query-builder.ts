import { Injectable } from '@nestjs/common';
import { QueryOptions } from '../dto/query-options.dto';

@Injectable()
export class BaseQueryBuilder {
  protected conditions = {};
  protected orders = {};

  withSearch(fields: string[], value: string) {
    if (value && fields.length > 0) {
      this.conditions = {
        AND: { isDeleted: false },
        OR: fields.map((field) => ({ [field]: { contains: value } })),
      };
    }
    return this;
  }

  withOrder(field?: string, direction?: 'asc' | 'desc') {
    this.orders = { [field]: direction };
    return this;
  }
}

@Injectable()
export class OffsetQueryBuilder extends BaseQueryBuilder {
  private skip = 0;
  private take = 10;

  withOffset(page: number, pageSize: number) {
    this.skip = page <= 1 ? 0 : (page - 1) * pageSize;
    this.take = pageSize;
    return this;
  }

  build(): QueryOptions {
    return {
      where: this.conditions,
      orderBy: this.orders,
      skip: this.skip,
      take: this.take,
    };
  }
}

@Injectable()
export class CursorQueryBuilder extends BaseQueryBuilder {
  private cursor: number | null = null;
  private limit = 10;

  withCursor(cursor: number, limit: number) {
    this.cursor = cursor;
    this.limit = limit;
    return this;
  }

  build(): QueryOptions {
    const query: QueryOptions = {
      where: this.conditions,
      orderBy: this.orders,
      take: this.limit,
    };

    if (this.cursor !== null && this.cursor !== undefined) {
      query.cursor = { id: this.cursor };
    }
    return query;
  }
}
