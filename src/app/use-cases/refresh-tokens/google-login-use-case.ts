import { Injectable } from '@nestjs/common';

import { JWTAdapter } from '@app/adapters/jwt-adapter';

import {
  GoogleClientAdapter,
  Payload,
} from '@app/adapters/google-client-adapter';

import { GenerateAccessTokenUseCase } from './generate-access-token-use-case';
import { CreateRefreshTokenUseCase } from './create-refresh-token-use-case';
import { PayloadEmptyError } from '../errors/payload-empty.error';
import { GetUserByEmailUseCase } from '../users/get-user-by-email-use-case';
import { CreateUserUseCase } from '../users/create-user-use-case';
import { UserExistsByEmailUseCase } from '../users/user-exists-by-email-use-case';

interface ExecuteParams {
  token: string;
  browser?: string;
  os?: string;
}

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private jwtAdapter: JWTAdapter,
    private createRefreshToken: CreateRefreshTokenUseCase,
    private generateAccessToken: GenerateAccessTokenUseCase,
    private getUserByEmail: GetUserByEmailUseCase,
    private userExistsByEmail: UserExistsByEmailUseCase,
    private createUser: CreateUserUseCase,
    private googleClientAdapter: GoogleClientAdapter,
  ) {}

  async execute({ token, browser = 'Unknown', os = 'Unknown' }: ExecuteParams) {
    const ticket = await this.googleClientAdapter.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new PayloadEmptyError();
    }

    const { user } = await this.getUser(payload);

    const { accessToken } = await this.generateAccessToken.execute(user.id);

    const refreshToken = await this.jwtAdapter.sign(
      {
        sub: user.id,
      },
      process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    );

    await this.createRefreshToken.execute({
      token: refreshToken,
      browser,
      os,
      user,
    });

    const { email, name, role } = user;

    return { accessToken, refreshToken, email, name, role };
  }

  private async getUser(payload: Payload) {
    const userAlreadyExists = await this.userExistsByEmail.execute(
      String(payload.email),
    );

    if (!userAlreadyExists) {
      return this.createUser.execute({
        name: String(payload.name),
        email: String(payload.email),
        picture: payload.picture,
        role: 'user',
        provider: 'google',
      });
    }

    return this.getUserByEmail.execute(String(payload.email));
  }
}
