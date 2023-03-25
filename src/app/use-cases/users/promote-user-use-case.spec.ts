import { makeUser, makeRepository } from '@test/factories/user-factory';

import { ReplaceUserUseCase } from './replace-user-use-case';
import { PromoteUserUseCase } from './promote-user-use-case';
import { GetUserByEmailUseCase } from './get-user-by-email-use-case';

describe('PromoteUser use case', () => {
  it('should be able to promote an user', async () => {
    const initialUser = makeUser();

    const userRepository = makeRepository([initialUser]);

    const getUserByEmail = new GetUserByEmailUseCase(userRepository);

    const replaceUser = new ReplaceUserUseCase(userRepository);

    const promoteUser = new PromoteUserUseCase(replaceUser, getUserByEmail);

    await promoteUser.execute(initialUser.email, 'other-role');

    expect(userRepository.users).toHaveLength(1);
    expect(userRepository.users[0]).toBeTruthy();
    expect(userRepository.users[0].role).toEqual('other-role');
  });
});
