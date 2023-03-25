import { User, CreateUserProps } from '@app/entities/user';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user-repository';
import { RepositoryUtils } from '@test/utils/repository-utils';

import { generateArray } from './generic-factory';

export function makeUser(user: Partial<CreateUserProps> = {}) {
  return new User({
    id: user.id ?? 'test-id',
    createdAt: user.createdAt ?? 'test-created-at',
    updatedAt: user.updatedAt ?? 'test-updated-at',
    email: user.email ?? 'test-email',
    name: user.name ?? 'test-name',
    role: user.role ?? 'test-role',
    password: user.password ?? 'test-password',
    picture: user.picture ?? 'test-picture',
    provider: user.provider ?? 'local',
  });
}

const defaultMap = (i: number) => {
  return {
    name: `Test User #${i}`,
  };
};

export function generateUsers(
  total = 100,
  map: (i: number) => Partial<CreateUserProps> = defaultMap,
) {
  return generateArray((i) => {
    const id = String(i);

    const props = map(i);

    return makeUser({ id, ...props });
  }, total);
}

export function makeRepository(users: User[] = []) {
  const utils = new RepositoryUtils<User>();

  return new InMemoryUserRepository(users, utils);
}
