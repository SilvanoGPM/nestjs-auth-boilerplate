import { Injectable } from '@nestjs/common';

import { Pageable } from '@app/repositories/pages.type';

import { OnlyNumbersError } from '../errors/only-numbers.error';

@Injectable()
export class GenericService {
  public getPageParamsByQuery({ page: rawPage, size: rawSize }: Pageable) {
    const DEFAULT_PAGE = 1;
    const DEFAULT_SIZE = 10;

    const page = rawPage ? Number(rawPage) : DEFAULT_PAGE;
    const size = rawSize ? Number(rawSize) : DEFAULT_SIZE;

    if (isNaN(page) || isNaN(size)) {
      throw new OnlyNumbersError('Page or size is invalid!');
    }

    return { page, size };
  }
}
