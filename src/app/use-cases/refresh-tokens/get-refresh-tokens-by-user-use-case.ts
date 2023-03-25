import { Injectable } from '@nestjs/common';

import { RefreshTokenRepository } from '@app/repositories/refresh-token-repository';
import { Pageable } from '@app/repositories/pages.type';
import { GetUserByEmailUseCase } from '../users/get-user-by-email-use-case';

interface ExecuteParams extends Pageable {
  email: string;
}

@Injectable()
export class GetRefreshTokensByUserUseCase {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private getUserByEmail: GetUserByEmailUseCase,
  ) {}

  async execute({ email, ...pageable }: ExecuteParams) {
    const { user } = await this.getUserByEmail.execute(email);

    const tokens = await this.refreshTokenRepository.findManyByUser(
      user,
      pageable,
    );

    return { tokens };
  }
}
