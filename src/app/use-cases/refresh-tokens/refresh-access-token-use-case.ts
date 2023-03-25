import { Injectable } from '@nestjs/common';

import { JWTAdapter } from '@app/adapters/jwt-adapter';

import { GenerateAccessTokenUseCase } from './generate-access-token-use-case';
import { GetRefreshTokenByTokenUseCase } from './get-refresh-token-by-token-use-case';
import { GetUserByIdUseCase } from '../users/get-user-by-id-use-case';
import { InvalidTokenError } from '../errors/invalid-token.error';

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    private jwtAdapter: JWTAdapter,
    private getUserById: GetUserByIdUseCase,
    private getRefreshTokenByToken: GetRefreshTokenByTokenUseCase,
    private generateAccessToken: GenerateAccessTokenUseCase,
  ) {}

  async execute(actualRefreshToken: string) {
    const { sub: userId } = await this.jwtAdapter.verify(actualRefreshToken);

    const { user } = await this.getUserById.execute(userId);

    const { refreshToken } = await this.getRefreshTokenByToken.execute(
      actualRefreshToken,
    );

    const tokenIsValid = refreshToken.user.id === userId;

    if (!tokenIsValid) {
      throw new InvalidTokenError();
    }

    return this.generateAccessToken.execute(user.id);
  }
}
