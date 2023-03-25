import { Injectable } from '@nestjs/common';

import { Pageable } from '@app/repositories/pages.type';
import { UserRepository } from '@app/repositories/user-repository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(pageable: Pageable) {
    const users = await this.userRepository.findMany(pageable);

    return { users };
  }
}
