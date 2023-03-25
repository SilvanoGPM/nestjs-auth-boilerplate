import { makeUser, makeRepository } from '@test/factories/user-factory';

import { UserExistsByEmailUseCase } from './user-exists-by-email-use-case';

describe('UserExistsByEmail use case', () => {
  it('should be able to get true when user exists', async () => {
    const initialUser = makeUser();

    const userRepository = makeRepository([initialUser]);

    const userExistsByEmail = new UserExistsByEmailUseCase(userRepository);

    const userExists = await userExistsByEmail.execute(initialUser.email);

    expect(userExists).toBeTruthy();
  });

  it('should be able to get false when not user exists', async () => {
    const userRepository = makeRepository([]);

    const userExistsByEmail = new UserExistsByEmailUseCase(userRepository);

    const userExists = await userExistsByEmail.execute('random-email');

    expect(userExists).toBeFalsy();
  });
});
