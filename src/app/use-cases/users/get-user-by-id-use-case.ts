import { Injectable } from '@nestjs/common';

import { UserRepository } from '@app/repositories/user-repository';

import { NotFoundError } from '../errors/not-found.error';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError(`User not found with id [${id}]`);
    }

    return { user };
  }
}
