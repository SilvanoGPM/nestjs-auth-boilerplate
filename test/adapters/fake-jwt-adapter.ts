import { JWTAdapter } from '@app/adapters/jwt-adapter';
import { InMemoryRefreshTokenRepository } from '@test/repositories/in-memory-refresh-token-repository';

export class FakeJWTAdapter implements JWTAdapter {
  constructor(private refreshTokenRepository: InMemoryRefreshTokenRepository) {}

  async sign(payload: { sub: string }) {
    return payload.sub;
  }

  async verify(refreshToken: string) {
    const token = this.refreshTokenRepository.refreshTokens.find(
      (token) => token.token === refreshToken,
    );

    return {
      sub: token?.user.id ?? '',
    };
  }

  async validateUser(email: string) {
    const token = this.refreshTokenRepository.refreshTokens.find(
      (token) => token.user.email === email,
    );

    if (!token) {
      return null;
    }

    return token.user;
  }
}
