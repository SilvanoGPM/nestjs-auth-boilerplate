import { Injectable } from '@nestjs/common';

import { RefreshTokenRepository } from '@app/repositories/refresh-token-repository';
import { User } from '@app/entities/user';

import { GetRefreshTokenByIdUseCase } from './get-refresh-token-by-id-use-case';
import { InsufficientPermissionError } from '../errors/insufficient-permission.error';

@Injectable()
export class RevokeRefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private getRefreshTokenById: GetRefreshTokenByIdUseCase,
  ) {}

  async execute(id: string, user: User) {
    const { refreshToken } = await this.getRefreshTokenById.execute(id);

    const isOwner = refreshToken.user.email === user.email;
    const isAdmin = user.role === 'admin';
    const isAllowed = isOwner || isAdmin;

    if (!isAllowed) {
      throw new InsufficientPermissionError();
    }

    await this.refreshTokenRepository.delete(refreshToken);
  }
}
