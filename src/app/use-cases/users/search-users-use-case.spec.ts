import { User } from '@app/entities/user';
import { generateUsers, makeRepository } from '@test/factories/user-factory';
import { SearchUsersUseCase } from './search-users-use-case';

describe('SearchUsers use case', () => {
  it('should be able to search all users with pagination when search not send', async () => {
    const TOTAL_ELEMENTS = 100;

    const repositoryData = generateUsers(TOTAL_ELEMENTS);

    const userRepository = makeRepository(repositoryData);

    const searchUsers = new SearchUsersUseCase(userRepository);

    const { users } = await searchUsers.execute();

    expect(users).toBeTruthy();
    expect(users.hasNext).toBeTruthy();
    expect(users.page).toEqual(1);
    expect(users.size).toEqual(10);
    expect(users.total).toEqual(TOTAL_ELEMENTS);

    expect(users.data).toHaveLength(10);
    expect(users.data[0]).toBeInstanceOf(User);
  });

  it('should be able to search users with pagination', async () => {
    const TOTAL_OF_USERS_WITH_TEN_ON_NAME = 2;

    const repositoryData = generateUsers();

    const userRepository = makeRepository(repositoryData);

    const searchUsers = new SearchUsersUseCase(userRepository);

    const params = {
      page: 1,
      size: 10,
      name: '10',
    };

    const { users } = await searchUsers.execute(params);

    expect(users).toBeTruthy();
    expect(users.hasNext).toBeFalsy();
    expect(users.page).toEqual(params.page);
    expect(users.size).toEqual(params.size);
    expect(users.total).toEqual(TOTAL_OF_USERS_WITH_TEN_ON_NAME);

    expect(users.data).toHaveLength(TOTAL_OF_USERS_WITH_TEN_ON_NAME);
    expect(users.data[0]).toBeInstanceOf(User);
  });
});
