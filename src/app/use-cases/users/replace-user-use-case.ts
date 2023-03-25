import { Injectable } from '@nestjs/common';

import { UserRepository } from '@app/repositories/user-repository';
import { UserProps, User } from '@app/entities/user';

import { NotFoundError } from '../errors/not-found.error';

@Injectable()
export class ReplaceUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(props: UserProps & { id: string }) {
    const user = new User(props);

    const exists = await this.userRepository.save(user);

    if (!exists) {
      throw new NotFoundError(`User not found with id [${props.id}]`);
    }

    return { user };
  }
}
