import { Injectable } from '@nestjs/common';

import { RefreshTokenRepository } from '@app/repositories/refresh-token-repository';

import { GetRefreshTokenByIdUseCase } from './get-refresh-token-by-id-use-case';
import { InsufficientPermissionError } from '../errors/insufficient-permission.error';

@Injectable()
export class RevokeRefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private getRefreshTokenById: GetRefreshTokenByIdUseCase,
  ) {}

  async execute(id: string, email: string) {
    const { refreshToken } = await this.getRefreshTokenById.execute(id);

    const isOwner = refreshToken.user.email === email;

    if (!isOwner) {
      throw new InsufficientPermissionError();
    }

    await this.refreshTokenRepository.delete(refreshToken);
  }
}
