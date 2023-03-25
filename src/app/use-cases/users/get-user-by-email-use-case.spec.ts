import { User } from '@app/entities/user';
import { makeUser, makeRepository } from '@test/factories/user-factory';

import { NotFoundError } from '../errors/not-found.error';
import { GetUserByEmailUseCase } from './get-user-by-email-use-case';

describe('GetUserByEmail use case', () => {
  it('should be able to get an user', async () => {
    const initialUser = makeUser();

    const userRepository = makeRepository([initialUser]);

    const getUserByEmail = new GetUserByEmailUseCase(userRepository);

    const { user } = await getUserByEmail.execute(initialUser.email);

    expect(user).toBeInstanceOf(User);
  });

  it('should not be able to get an user when it does not exists', async () => {
    const userRepository = makeRepository([]);

    const getUserByEmail = new GetUserByEmailUseCase(userRepository);

    expect(() => {
      return getUserByEmail.execute('random-email');
    }).rejects.toThrow(NotFoundError);
  });
});
