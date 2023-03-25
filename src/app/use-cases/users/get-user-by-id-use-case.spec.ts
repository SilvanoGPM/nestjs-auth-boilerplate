import { User } from '@app/entities/user';
import { makeUser, makeRepository } from '@test/factories/user-factory';

import { NotFoundError } from '../errors/not-found.error';
import { GetUserByIdUseCase } from './get-user-by-id-use-case';

describe('GetUserById use case', () => {
  it('should be able to get an user', async () => {
    const initialUser = makeUser();

    const userRepository = makeRepository([initialUser]);

    const getUserById = new GetUserByIdUseCase(userRepository);

    const { user } = await getUserById.execute(initialUser.id);

    expect(user).toBeInstanceOf(User);
  });

  it('should not be able to get an user when it does not exists', async () => {
    const userRepository = makeRepository([]);

    const getUserById = new GetUserByIdUseCase(userRepository);

    expect(() => {
      return getUserById.execute('random-id');
    }).rejects.toThrow(NotFoundError);
  });
});
