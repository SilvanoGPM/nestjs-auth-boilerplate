import { Injectable } from '@nestjs/common';

import { UserRepository, UserSearch } from '@app/repositories/user-repository';

@Injectable()
export class SearchUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(search: UserSearch = { page: 1, size: 10 }) {
    const users = await this.userRepository.search(search);

    return { users };
  }
}
