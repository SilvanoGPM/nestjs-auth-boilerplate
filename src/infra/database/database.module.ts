import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserRepository } from '@app/repositories/user-repository';
import { RefreshTokenRepository } from '@app/repositories/refresh-token-repository';
import { JWTAdapter } from '@app/adapters/jwt-adapter';

import { PrismaService } from './prisma/prisma.service';
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';
import { PrismaRefreshTokenRepository } from './prisma/repositories/prisma-refresh-token-repository';
import { PrismaJWTAdapter } from './prisma/adapters/prisma-jwt-adapter';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],

  providers: [
    PrismaService,

    {
      provide: JWTAdapter,
      useClass: PrismaJWTAdapter,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
  exports: [UserRepository, RefreshTokenRepository, JWTAdapter],
})
export class DatabaseModule {}
