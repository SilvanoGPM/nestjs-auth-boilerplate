import { Module } from '@nestjs/common';

import { ReplaceUserUseCase } from '@app/use-cases/users/replace-user-use-case';
import { PromoteUserUseCase } from '@app/use-cases/users/promote-user-use-case';
import { LoginUseCase } from '@app/use-cases/refresh-tokens/login-use-case';
import { GoogleLoginUseCase } from '@app/use-cases/refresh-tokens/google-login-use-case';
import { RefreshAccessTokenUseCase } from '@app/use-cases/refresh-tokens/refresh-access-token-use-case';
import { CreateRefreshTokenUseCase } from '@app/use-cases/refresh-tokens/create-refresh-token-use-case';
import { GenerateAccessTokenUseCase } from '@app/use-cases/refresh-tokens/generate-access-token-use-case';
import { GetRefreshTokenByTokenUseCase } from '@app/use-cases/refresh-tokens/get-refresh-token-by-token-use-case';
import { GetRefreshTokenByIdUseCase } from '@app/use-cases/refresh-tokens/get-refresh-token-by-id-use-case';
import { GetRefreshTokensByUserUseCase } from '@app/use-cases/refresh-tokens/get-refresh-tokens-by-user-use-case';
import { RevokeRefreshTokenUseCase } from '@app/use-cases/refresh-tokens/revoke-refresh-token-use-case';

import { GenericModule } from './generic.module';
import { UserExistsByEmailUseCase } from '@app/use-cases/users/user-exists-by-email-use-case';
import { CreateUserUseCase } from '@app/use-cases/users/create-user-use-case';

export const cases = [
  UserExistsByEmailUseCase,

  LoginUseCase,
  GoogleLoginUseCase,
  RefreshAccessTokenUseCase,
  CreateUserUseCase,
  CreateRefreshTokenUseCase,
  GenerateAccessTokenUseCase,
  GetRefreshTokenByTokenUseCase,
  GetRefreshTokenByIdUseCase,
  GetRefreshTokensByUserUseCase,
  RevokeRefreshTokenUseCase,
  ReplaceUserUseCase,
  PromoteUserUseCase,
];

@Module({
  imports: [GenericModule],
  providers: cases,
  exports: cases,
})
export class UserModule {}
