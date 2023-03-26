import {
  generateRefreshTokens,
  makeRepository,
} from '@test/factories/refresh-token-factory';
import { makeUser } from '@test/factories/user-factory';
import { InsufficientPermissionError } from '../errors/insufficient-permission.error';

import { GetRefreshTokenByIdUseCase } from './get-refresh-token-by-id-use-case';
import { RevokeRefreshTokenUseCase } from './revoke-refresh-token-use-case';

describe('RevokeRefreshToken use case', () => {
  it('should be able to delete refresh token', async () => {
    const TOTAL_ELEMENTS = 100;

    const repositoryData = generateRefreshTokens(TOTAL_ELEMENTS);

    const refreshTokenRepository = makeRepository(repositoryData);

    const getRefreshTokenById = new GetRefreshTokenByIdUseCase(
      refreshTokenRepository,
    );

    const revokeRefreshToken = new RevokeRefreshTokenUseCase(
      refreshTokenRepository,
      getRefreshTokenById,
    );

    const refreshToken = repositoryData[0];

    await revokeRefreshToken.execute(refreshToken.id, makeUser());

    expect(refreshTokenRepository.refreshTokens.length).toEqual(
      TOTAL_ELEMENTS - 1,
    );

    expect(refreshTokenRepository.refreshTokens[0]).not.toEqual(refreshToken);
  });

  it('should not be able to delete refresh token when user not is owner', async () => {
    const TOTAL_ELEMENTS = 100;

    const repositoryData = generateRefreshTokens(TOTAL_ELEMENTS);

    const refreshTokenRepository = makeRepository(repositoryData);

    const getRefreshTokenById = new GetRefreshTokenByIdUseCase(
      refreshTokenRepository,
    );

    const revokeRefreshToken = new RevokeRefreshTokenUseCase(
      refreshTokenRepository,
      getRefreshTokenById,
    );

    const refreshToken = repositoryData[0];

    expect(() => {
      return revokeRefreshToken.execute(
        refreshToken.id,
        makeUser({ email: 'other@mail.com' }),
      );
    }).rejects.toThrow(InsufficientPermissionError);
  });
});
