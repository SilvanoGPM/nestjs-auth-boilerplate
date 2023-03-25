import { User } from '@app/entities/user';
import { generateUsers, makeRepository } from '@test/factories/user-factory';

import { GetAllUsersUseCase } from './get-all-users-use-case';

describe('GetAllUsers use case', () => {
  it('should be able to get all users with pagination', async () => {
    const TOTAL_ELEMENTS = 100;

    const repositoryData = generateUsers(TOTAL_ELEMENTS);

    const userRepository = makeRepository(repositoryData);

    const getAllUsers = new GetAllUsersUseCase(userRepository);

    const params = {
      page: 1,
      size: 10,
    };

    const { users } = await getAllUsers.execute(params);

    expect(users).toBeTruthy();
    expect(users.hasNext).toBeTruthy();
    expect(users.page).toEqual(params.page);
    expect(users.size).toEqual(params.size);
    expect(users.total).toEqual(TOTAL_ELEMENTS);

    expect(users.data).toHaveLength(params.size);
    expect(users.data[0]).toBeInstanceOf(User);
  });
});
