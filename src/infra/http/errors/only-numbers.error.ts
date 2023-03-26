import { BadRequestException } from '@nestjs/common';

export class OnlyNumbersError extends BadRequestException {
  constructor(msg: string, description?: string) {
    super(msg, {
      cause: new Error(),
      description: description ?? 'Only numerical values ​​are accepted',
    });
  }
}
