import { Injectable } from '@nestjs/common';

import { UserRepository } from '@app/repositories/user-repository';

import { NotFoundError } from '../errors/not-found.error';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError(`User not found with email [${email}]`);
    }

    return { user };
  }
}
