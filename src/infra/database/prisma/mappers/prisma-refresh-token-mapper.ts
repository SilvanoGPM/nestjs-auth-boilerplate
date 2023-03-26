import {
  RefreshToken as PrismaRefreshToken,
  User as PrismaUser,
} from '@prisma/client';

import { RefreshToken } from '@app/entities/refresh-token';

import { PrismaUserMapper } from './prisma-user-mapper';

export class PrismaRefreshTokenMapper {
  static toDomain(rawRefreshToken: PrismaRefreshToken & { user: PrismaUser }) {
    return new RefreshToken({
      id: rawRefreshToken.id,
      createdAt: rawRefreshToken.createdAt.toISOString(),
      updatedAt: rawRefreshToken.updatedAt.toISOString(),
      token: rawRefreshToken.token,
      browser: rawRefreshToken.browser,
      os: rawRefreshToken.os,
      user: PrismaUserMapper.toDomain(rawRefreshToken.user),
    });
  }

  static toPrisma(refreshToken: RefreshToken) {
    return {
      id: refreshToken.id,
      token: refreshToken.token,
      browser: refreshToken.browser,
      os: refreshToken.os,
      userId: refreshToken.user.id,
    };
  }
}
