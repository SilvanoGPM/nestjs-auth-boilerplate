import { Injectable } from '@nestjs/common';

import { Pageable } from '@app/repositories/pages.type';

interface GetPageParams<T> extends Pageable {
  data: T[];
}

interface FindByString<T> {
  data: T[];
  property: keyof T;
  search: string;
}

interface RangeParams {
  value: number;
  min?: number;
  max?: number;
}

@Injectable()
export class RepositoryUtils<T> {
  public findByString({ data, property, search }: FindByString<T>) {
    const searchFormatted = search.toLowerCase().replace('-', ' ');

    function findByProperty(item: T) {
      const value = item[property];

      if (typeof value !== 'string') {
        throw new Error(`Property [${String(property)}] not is a String.`);
      }

      const valueFormatted = value.toLowerCase().replace('-', ' ');

      return valueFormatted === searchFormatted;
    }

    const value = data.find(findByProperty);

    if (!value) {
      return null;
    }

    return value;
  }

  public like(first: string, second?: string) {
    if (second === undefined || second === '') {
      return true;
    }

    return first.toLowerCase().includes(second.toLowerCase());
  }

  public range({ value, min = 0, max }: RangeParams) {
    const isMin = value >= min;
    const isMax = max ? value <= max : true;

    return isMin && isMax;
  }

  public getPage({ data: rawData, page, size }: GetPageParams<T>) {
    const start = size * (page - 1);
    const end = start + size;

    const total = rawData.length;

    const data = rawData.slice(start, end);

    const hasNext = Boolean(rawData[end]);

    return {
      data,
      page,
      size,
      total,
      hasNext,
    };
  }
}
