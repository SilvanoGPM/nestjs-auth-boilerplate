import { RefreshToken } from '@app/entities/refresh-token';

import {
  makeRefreshToken,
  makeRepository,
} from '@test/factories/refresh-token-factory';

import { NotFoundError } from '../errors/not-found.error';
import { GetRefreshTokenByIdUseCase } from './get-refresh-token-by-id-use-case';

describe('GetRefreshTokenById use case', () => {
  it('should be able to get a token', async () => {
    const initialToken = makeRefreshToken();

    const refreshTokenRepository = makeRepository([initialToken]);

    const getRefreshTokenById = new GetRefreshTokenByIdUseCase(
      refreshTokenRepository,
    );

    const { refreshToken } = await getRefreshTokenById.execute(initialToken.id);

    expect(refreshToken).toBeInstanceOf(RefreshToken);
    expect(refreshToken).toEqual(initialToken);
  });

  it('should not be able to get a token when it does not exists', async () => {
    const refreshTokenRepository = makeRepository();

    const getRefreshTokenById = new GetRefreshTokenByIdUseCase(
      refreshTokenRepository,
    );

    expect(() => {
      return getRefreshTokenById.execute('random-id');
    }).rejects.toThrow(NotFoundError);
  });
});
