import { User } from '@app/entities/user';

import { Pageable } from '@app/repositories/pages.type';
import { UserRepository } from '@app/repositories/user-repository';
import { RepositoryUtils } from '@test/utils/repository-utils';

export class InMemoryUserRepository implements UserRepository {
  constructor(
    public users: User[] = [],
    private utils: RepositoryUtils<User>,
  ) {}

  async findMany(pageable: Pageable) {
    return this.utils.getPage({ data: this.users, ...pageable });
  }

  async findByEmail(email: string) {
    const user = this.users.find((innerUser) => innerUser.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findById(id: string) {
    const user = this.users.find((innerUser) => innerUser.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async existsByEmail(email: string) {
    const user = this.users.find((innerUser) => innerUser.email === email);

    return Boolean(user);
  }

  async create(user: User) {
    this.users.push(user);
  }

  async save(user: User) {
    const index = this.users.findIndex((innerUser) => innerUser.id === user.id);

    const exists = index >= 0;

    if (exists) {
      this.users[index] = user;
    }

    return exists;
  }
}
