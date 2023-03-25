import { Injectable } from '@nestjs/common';

import { GetUserByEmailUseCase } from './get-user-by-email-use-case';
import { ReplaceUserUseCase } from './replace-user-use-case';

@Injectable()
export class PromoteUserUseCase {
  constructor(
    private replaceUser: ReplaceUserUseCase,
    private getUserByEmail: GetUserByEmailUseCase,
  ) {}

  async execute(email: string, role: string) {
    const { user } = await this.getUserByEmail.execute(email);

    const { id, name, password, picture, provider } = user;

    await this.replaceUser.execute({
      id,
      email,
      name,
      password,
      role,
      picture,
      provider,
    });
  }
}
