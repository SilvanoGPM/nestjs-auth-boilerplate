import { RefreshToken } from '@app/entities/refresh-token';

import {
  generateRefreshTokens,
  makeRefreshToken,
  makeRepository as makeRefreshTokenRepository,
} from '@test/factories/refresh-token-factory';

import {
  makeRepository as makeUserRepository,
  makeUser,
} from '@test/factories/user-factory';

import { GetUserByEmailUseCase } from '../users/get-user-by-email-use-case';
import { GetRefreshTokensByUserUseCase } from './get-refresh-tokens-by-user-use-case';

describe('GetRefreshTokensByUser use case', () => {
  it('should be able to get all user refresh tokens with pagination', async () => {
    const user = makeUser({ email: 'token@mail.com' });

    const userRepository = makeUserRepository([user]);

    const getUserByEmail = new GetUserByEmailUseCase(userRepository);

    const TOTAL_ELEMENTS = 100;

    const repositoryData = generateRefreshTokens(TOTAL_ELEMENTS);

    repositoryData.push(
      makeRefreshToken({ token: 'Test token with this user', user }),
    );

    const refreshTokenRepository = makeRefreshTokenRepository(repositoryData);

    const getRefreshTokensByUser = new GetRefreshTokensByUserUseCase(
      refreshTokenRepository,
      getUserByEmail,
    );

    const params = {
      email: user.email,
      page: 1,
      size: 10,
    };

    const { tokens } = await getRefreshTokensByUser.execute(params);

    expect(tokens).toBeTruthy();
    expect(tokens.hasNext).toBeFalsy();
    expect(tokens.page).toEqual(params.page);
    expect(tokens.size).toEqual(params.size);
    expect(tokens.total).toEqual(1);

    expect(tokens.data).toHaveLength(1);
    expect(tokens.data[0]).toBeInstanceOf(RefreshToken);

    expect(tokens.data[0].user).toEqual(user);
  });
});
