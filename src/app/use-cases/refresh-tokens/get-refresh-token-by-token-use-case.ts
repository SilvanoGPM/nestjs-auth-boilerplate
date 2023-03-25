import { Injectable } from '@nestjs/common';

import { RefreshTokenRepository } from '@app/repositories/refresh-token-repository';

import { NotFoundError } from '../errors/not-found.error';

@Injectable()
export class GetRefreshTokenByTokenUseCase {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async execute(token: string) {
    const refreshToken = await this.refreshTokenRepository.findByToken(token);

    if (!refreshToken) {
      throw new NotFoundError(`Refresh token not found with token [${token}]`);
    }

    return { refreshToken };
  }
}
