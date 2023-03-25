import { FakeJWTAdapter } from '@test/adapters/fake-jwt-adapter';
import {
  makeRefreshToken,
  makeRepository as makeRefreshTokenRepository,
} from '@test/factories/refresh-token-factory';

import {
  makeRepository as makeUserRepository,
  makeUser,
} from '@test/factories/user-factory';
import { InvalidTokenError } from '../errors/invalid-token.error';

import { GetUserByIdUseCase } from '../users/get-user-by-id-use-case';
import { GenerateAccessTokenUseCase } from './generate-access-token-use-case';
import { GetRefreshTokenByTokenUseCase } from './get-refresh-token-by-token-use-case';
import { RefreshAccessTokenUseCase } from './refresh-access-token-use-case';

describe('RefreshAccessToken use case', () => {
  it('should be able to refresh access token', async () => {
    const initialUser = makeUser({ id: 'new-user-id' });

    const userRepository = makeUserRepository([initialUser]);

    const getUserById = new GetUserByIdUseCase(userRepository);

    const initialToken = makeRefreshToken({
      user: initialUser,
    });

    const refreshTokenRepository = makeRefreshTokenRepository([initialToken]);

    const jwtAdapter = new FakeJWTAdapter(refreshTokenRepository);

    const getRefreshTokenByToken = new GetRefreshTokenByTokenUseCase(
      refreshTokenRepository,
    );

    const generateAccessToken = new GenerateAccessTokenUseCase(jwtAdapter);

    const refreshAccessToken = new RefreshAccessTokenUseCase(
      jwtAdapter,
      getUserById,
      getRefreshTokenByToken,
      generateAccessToken,
    );

    const { accessToken } = await refreshAccessToken.execute(
      initialToken.token,
    );

    expect(accessToken).toEqual(initialUser.id);
  });

  it('should be able to refresh access token', async () => {
    const initialUser = makeUser({ id: 'new-user-id' });

    const userRepository = makeUserRepository([initialUser, makeUser()]);

    const getUserById = new GetUserByIdUseCase(userRepository);

    const initialToken = makeRefreshToken({ user: initialUser });

    const refreshTokenRepository = makeRefreshTokenRepository([initialToken]);

    const jwtAdapter = new FakeJWTAdapter(refreshTokenRepository);

    jwtAdapter.verify = async () => {
      return {
        sub: makeUser().id ?? '',
      };
    };

    const getRefreshTokenByToken = new GetRefreshTokenByTokenUseCase(
      refreshTokenRepository,
    );

    const generateAccessToken = new GenerateAccessTokenUseCase(jwtAdapter);

    const refreshAccessToken = new RefreshAccessTokenUseCase(
      jwtAdapter,
      getUserById,
      getRefreshTokenByToken,
      generateAccessToken,
    );

    expect(() => {
      return refreshAccessToken.execute(initialToken.token);
    }).rejects.toThrow(InvalidTokenError);
  });
});
