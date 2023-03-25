import { makeUser } from '@test/factories/user-factory';

describe('User entity', () => {
  it('should be able to create an user', () => {
    const user = makeUser();

    expect(user).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        _createdAt: expect.any(String),
        _updatedAt: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
      }),
    );
  });
});
