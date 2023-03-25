import { Injectable } from '@nestjs/common';

import { JWTAdapter } from '@app/adapters/jwt-adapter';

@Injectable()
export class GenerateAccessTokenUseCase {
  constructor(private jwtAdapter: JWTAdapter) {}

  async execute(userId: string) {
    const accessToken = await this.jwtAdapter.sign(
      { sub: userId },
      process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    );

    return { accessToken };
  }
}
