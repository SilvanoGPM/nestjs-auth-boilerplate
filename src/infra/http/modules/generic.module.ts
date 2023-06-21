import { Module } from '@nestjs/common';

import { GetUserByIdUseCase } from '@app/use-cases/users/get-user-by-id-use-case';
import { GetRefreshTokenByTokenUseCase } from '@app/use-cases/refresh-tokens/get-refresh-token-by-token-use-case';
import { DatabaseModule } from '@infra/database/database.module';
import { GetUserByEmailUseCase } from '@app/use-cases/users/get-user-by-email-use-case';
import { GoogleClientAdapter } from '@app/adapters/google-client-adapter';

import { GenericService } from '../services/generic.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from '../auth/strategies/refresh.strategy';
import { HTTPGoogleClientAdapter } from '../adapters/http-google-client-adapter';

@Module({
  imports: [DatabaseModule],
  providers: [
    GenericService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    GetRefreshTokenByTokenUseCase,
    {
      provide: GoogleClientAdapter,
      useClass: HTTPGoogleClientAdapter,
    },
  ],
  exports: [
    DatabaseModule,
    GenericService,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    GetRefreshTokenByTokenUseCase,
    GoogleClientAdapter,
  ],
})
export class GenericModule {}
