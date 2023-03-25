import { Injectable } from '@nestjs/common';

import { RefreshTokenRepository } from '@app/repositories/refresh-token-repository';

import { NotFoundError } from '../errors/not-found.error';

@Injectable()
export class GetRefreshTokenByIdUseCase {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async execute(id: string) {
    const refreshToken = await this.refreshTokenRepository.findById(id);

    if (!refreshToken) {
      throw new NotFoundError(`Refresh token not found with id [${id}]`);
    }

    return { refreshToken };
  }
}
