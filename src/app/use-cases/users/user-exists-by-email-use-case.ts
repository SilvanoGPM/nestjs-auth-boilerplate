import { Injectable } from '@nestjs/common';

import { UserRepository } from '@app/repositories/user-repository';

@Injectable()
export class UserExistsByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string) {
    const exists = await this.userRepository.existsByEmail(email);

    return exists;
  }
}
