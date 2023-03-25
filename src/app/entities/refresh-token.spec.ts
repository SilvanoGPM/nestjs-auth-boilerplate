import { makeRefreshToken } from '@test/factories/refresh-token-factory';
import { User } from './user';

describe('RefreshToken entity', () => {
  it('should be able to create a refresh token', () => {
    const refreshToken = makeRefreshToken();

    expect(refreshToken).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        _createdAt: expect.any(String),
        _updatedAt: expect.any(String),
        token: expect.any(String),
        browser: expect.any(String),
        os: expect.any(String),
        user: expect.any(User),
      }),
    );
  });
});
