import { UnauthorizedException } from '@nestjs/common';

export class RefreshTokenExpiredError extends UnauthorizedException {
  constructor(error: any) {
    super('Refresh token expired', {
      cause: error,
      description: error.message,
    });
  }
}
