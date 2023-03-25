import { RefreshToken } from '@app/entities/refresh-token';
import { User } from '@app/entities/user';
import { Pageable } from '@app/repositories/pages.type';
import { RefreshTokenRepository } from '@app/repositories/refresh-token-repository';
import { RepositoryUtils } from '@test/utils/repository-utils';

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    public refreshTokens: RefreshToken[] = [],
    private utils: RepositoryUtils<RefreshToken>,
  ) {}

  async findManyByUser(user: User, pageable: Pageable) {
    const tokens = this.refreshTokens.filter(
      (token) => token.user.email === user.email,
    );

    return this.utils.getPage({ data: tokens, ...pageable });
  }

  async findByToken(token: string) {
    const refreshToken = this.refreshTokens.find(
      (refreshToken) => refreshToken.token === token,
    );

    if (!refreshToken) {
      return null;
    }

    return refreshToken;
  }

  async findById(id: string) {
    const refreshToken = this.refreshTokens.find(
      (refreshToken) => refreshToken.id === id,
    );

    if (!refreshToken) {
      return null;
    }

    return refreshToken;
  }

  async create(refreshToken: RefreshToken) {
    this.refreshTokens.push(refreshToken);
  }

  async delete(refreshToken: RefreshToken) {
    this.refreshTokens = this.refreshTokens.filter(
      (innerRefreshToken) => innerRefreshToken.id !== refreshToken.id,
    );
  }
}
