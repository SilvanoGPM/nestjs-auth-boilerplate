import { User } from '@app/entities/user';
import { makeUser, makeRepository } from '@test/factories/user-factory';

import { NotFoundError } from '../errors/not-found.error';
import { ReplaceUserUseCase } from './replace-user-use-case';

describe('ReplaceUser use case', () => {
  it('should be able to replace an user', async () => {
    const initialUser = makeUser();

    const userRepository = makeRepository([initialUser]);

    const replaceUser = new ReplaceUserUseCase(userRepository);

    const params = {
      id: initialUser.id,
      name: 'test-user-updated',
      email: 'test-email',
      role: 'test-role',
      password: 'test-password',
    };

    const { user } = await replaceUser.execute(params);

    expect(userRepository.users).toHaveLength(1);
    expect(userRepository.users[0]).toEqual(user);
    expect(user).toBeInstanceOf(User);
  });

  it('should not be able to replace an user when it does not exists', async () => {
    const userRepository = makeRepository();

    const replaceUser = new ReplaceUserUseCase(userRepository);

    const params = {
      id: 'random-id',
      name: 'test-user-updated',
      email: 'test-email',
      role: 'test-role',
      password: 'test-password',
    };

    expect(() => {
      return replaceUser.execute(params);
    }).rejects.toThrow(NotFoundError);
  });
});
