import { FakeJWTAdapter } from '@test/adapters/fake-jwt-adapter';
import { makeRepository } from '@test/factories/refresh-token-factory';

import { GenerateAccessTokenUseCase } from './generate-access-token-use-case';

describe('GenerateAccessToken use case', () => {
  it('should be able to get an access token', async () => {
    const refreshTokenRepository = makeRepository();

    const jwtAdapter = new FakeJWTAdapter(refreshTokenRepository);

    const generateAccessToken = new GenerateAccessTokenUseCase(jwtAdapter);

    const userId = 'some-user-id';

    const { accessToken } = await generateAccessToken.execute(userId);

    expect(accessToken).toEqual(userId);
  });
});
