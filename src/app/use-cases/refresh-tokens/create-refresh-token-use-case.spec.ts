import { RefreshToken } from '@app/entities/refresh-token';
import { makeRepository } from '@test/factories/refresh-token-factory';
import { makeUser } from '@test/factories/user-factory';

import { CreateRefreshTokenUseCase } from './create-refresh-token-use-case';

describe('CreateRefreshToken use case', () => {
  it('should be able to create a refresh token', async () => {
    const refreshTokenRepository = makeRepository();

    const createRefreshToken = new CreateRefreshTokenUseCase(
      refreshTokenRepository,
    );

    const params = {
      token: 'test-token',
      browser: 'test-browser',
      os: 'test-os',
      user: makeUser(),
    };

    const { refreshToken } = await createRefreshToken.execute(params);

    expect(refreshTokenRepository.refreshTokens).toHaveLength(1);
    expect(refreshTokenRepository.refreshTokens[0]).toEqual(refreshToken);
    expect(refreshToken).toBeInstanceOf(RefreshToken);
  });
});
