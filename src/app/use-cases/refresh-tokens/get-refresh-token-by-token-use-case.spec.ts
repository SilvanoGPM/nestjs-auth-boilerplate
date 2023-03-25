import { RefreshToken } from '@app/entities/refresh-token';

import {
  makeRefreshToken,
  makeRepository,
} from '@test/factories/refresh-token-factory';

import { NotFoundError } from '../errors/not-found.error';
import { GetRefreshTokenByTokenUseCase } from './get-refresh-token-by-token-use-case';

describe('GetRefreshTokenByToken use case', () => {
  it('should be able to get a token', async () => {
    const initialToken = makeRefreshToken();

    const refreshTokenRepository = makeRepository([initialToken]);

    const getRefreshTokenByToken = new GetRefreshTokenByTokenUseCase(
      refreshTokenRepository,
    );

    const { refreshToken } = await getRefreshTokenByToken.execute(
      initialToken.token,
    );

    expect(refreshToken).toBeInstanceOf(RefreshToken);
    expect(refreshToken).toEqual(initialToken);
  });

  it('should not be able to get a token when it does not exists', async () => {
    const refreshTokenRepository = makeRepository();

    const getRefreshTokenByToken = new GetRefreshTokenByTokenUseCase(
      refreshTokenRepository,
    );

    expect(() => {
      return getRefreshTokenByToken.execute('random-token');
    }).rejects.toThrow(NotFoundError);
  });
});
