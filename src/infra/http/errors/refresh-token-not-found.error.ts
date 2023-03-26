import { NotFoundException } from '@nestjs/common';

export class RefreshTokenNotFoundError extends NotFoundException {
  constructor(error: any) {
    super('Refresh token not found', {
      cause: error,
      description: error.message,
    });
  }
}
