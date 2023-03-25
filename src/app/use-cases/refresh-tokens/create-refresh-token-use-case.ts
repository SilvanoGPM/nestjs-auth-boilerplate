import { Injectable } from '@nestjs/common';

import { RefreshTokenRepository } from '@app/repositories/refresh-token-repository';
import { RefreshToken, RefreshTokenProps } from '@app/entities/refresh-token';

@Injectable()
export class CreateRefreshTokenUseCase {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async execute(props: RefreshTokenProps) {
    const refreshToken = new RefreshToken(props);

    await this.refreshTokenRepository.create(refreshToken);

    return { refreshToken };
  }
}
