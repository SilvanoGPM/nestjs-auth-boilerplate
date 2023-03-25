import { User } from '@app/entities/user';
import { makeRepository } from '@test/factories/user-factory';

import { CreateUserUseCase } from './create-user-use-case';

describe('CreateUser use case', () => {
  it('should be able to create an user', async () => {
    const userRepository = makeRepository();

    const createUser = new CreateUserUseCase(userRepository);

    const params = {
      name: 'test-user',
      email: 'test-email',
      role: 'test-role',
      password: 'test-password',
    };

    const { user } = await createUser.execute(params);

    expect(userRepository.users).toHaveLength(1);
    expect(userRepository.users[0]).toEqual(user);
    expect(user).toBeInstanceOf(User);
  });
});
