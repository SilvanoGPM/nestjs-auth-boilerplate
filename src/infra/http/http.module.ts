import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';
import { GetAllUsersUseCase } from '@app/use-cases/users/get-all-users-use-case';
import { GetUserByEmailUseCase } from '@app/use-cases/users/get-user-by-email-use-case';
import { CreateUserUseCase } from '@app/use-cases/users/create-user-use-case';
import { UserExistsByEmailUseCase } from '@app/use-cases/users/user-exists-by-email-use-case';
import { RefreshAccessTokenUseCase } from '@app/use-cases/refresh-tokens/refresh-access-token-use-case';
import { LoginUseCase } from '@app/use-cases/refresh-tokens/login-use-case';
import { CreateRefreshTokenUseCase } from '@app/use-cases/refresh-tokens/create-refresh-token-use-case';
import { GenerateAccessTokenUseCase } from '@app/use-cases/refresh-tokens/generate-access-token-use-case';
import { GetRefreshTokenByTokenUseCase } from '@app/use-cases/refresh-tokens/get-refresh-token-by-token-use-case';
import { GetRefreshTokensByUserUseCase } from '@app/use-cases/refresh-tokens/get-refresh-tokens-by-user-use-case';
import { RevokeRefreshTokenUseCase } from '@app/use-cases/refresh-tokens/revoke-refresh-token-use-case';
import { GetUserByIdUseCase } from '@app/use-cases/users/get-user-by-id-use-case';
import { GetRefreshTokenByIdUseCase } from '@app/use-cases/refresh-tokens/get-refresh-token-by-id-use-case';
import { SearchUsersUseCase } from '@app/use-cases/users/search-users-use-case';
import { ReplaceUserUseCase } from '@app/use-cases/users/replace-user-use-case';
import { PromoteUserUseCase } from '@app/use-cases/users/promote-user-use-case';
import { GoogleLoginUseCase } from '@app/use-cases/refresh-tokens/google-login-use-case';
import { GoogleClientAdapter } from '@app/adapters/google-client-adapter';

import { GenericService } from './services/generic.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './auth/strategies/refresh.strategy';
import { HTTPGoogleClientAdapter } from './adapters/http-google-client-adapter';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, AuthController],
  providers: [
    GenericService,
    JwtStrategy,
    JwtRefreshTokenStrategy,

    GetAllUsersUseCase,
    SearchUsersUseCase,
    GetUserByEmailUseCase,
    GetUserByIdUseCase,
    CreateUserUseCase,
    UserExistsByEmailUseCase,

    {
      provide: GoogleClientAdapter,
      useClass: HTTPGoogleClientAdapter,
    },

    LoginUseCase,
    GoogleLoginUseCase,
    RefreshAccessTokenUseCase,
    CreateRefreshTokenUseCase,
    GenerateAccessTokenUseCase,
    GetRefreshTokenByTokenUseCase,
    GetRefreshTokenByIdUseCase,
    GetRefreshTokensByUserUseCase,
    RevokeRefreshTokenUseCase,
    ReplaceUserUseCase,
    PromoteUserUseCase,
  ],
})
export class HttpModule {}
