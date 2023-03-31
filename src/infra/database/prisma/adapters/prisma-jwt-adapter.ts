import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { JWTAdapter } from '@app/adapters/jwt-adapter';
import { PrismaService } from '@infra/database/prisma/prisma.service';

import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { TokenExpiredError } from '../errors/token-expired.error';
import { InvalidProviderError } from '@app/use-cases/errors/invalid-provider.error';

@Injectable()
export class PrismaJWTAdapter implements JWTAdapter {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async sign(payload: { sub: string }, expiresIn?: string | number) {
    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }

  async verify(token: string) {
    try {
      const { sub } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return { sub };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new TokenExpiredError(error.expiredAt);
      }

      throw error;
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user?.provider && user?.provider !== 'local') {
      throw new InvalidProviderError(user.provider);
    }

    const isSamePassword =
      user && (await compare(password, String(user.password)));

    if (!isSamePassword) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }
}
