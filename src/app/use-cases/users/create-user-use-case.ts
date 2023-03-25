import { Injectable } from '@nestjs/common';

import { UserRepository } from '@app/repositories/user-repository';
import { UserProps, User } from '@app/entities/user';

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(props: UserProps) {
    const user = new User(props);

    await this.userRepository.create(user);

    return { user };
  }
}
