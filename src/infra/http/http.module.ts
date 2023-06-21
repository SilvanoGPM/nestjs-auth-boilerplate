import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';
import { GetAllUsersUseCase } from '@app/use-cases/users/get-all-users-use-case';
import { GetUserByEmailUseCase } from '@app/use-cases/users/get-user-by-email-use-case';
import { CreateUserUseCase } from '@app/use-cases/users/create-user-use-case';
import { UserExistsByEmailUseCase } from '@app/use-cases/users/user-exists-by-email-use-case';
import { GetUserByIdUseCase } from '@app/use-cases/users/get-user-by-id-use-case';
import { SearchUsersUseCase } from '@app/use-cases/users/search-users-use-case';
import { GoogleClientAdapter } from '@app/adapters/google-client-adapter';

import { GenericService } from './services/generic.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './auth/strategies/refresh.strategy';
import { HTTPGoogleClientAdapter } from './adapters/http-google-client-adapter';
import { UserModule } from './modules/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
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
  ],
})
export class HttpModule {}
