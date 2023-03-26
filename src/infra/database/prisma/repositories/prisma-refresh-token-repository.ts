import { Prisma } from '@prisma/client';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { RefreshToken } from '@app/entities/refresh-token';
import { User } from '@app/entities/user';
import { Pageable } from '@app/repositories/pages.type';
import { RefreshTokenRepository } from '@app/repositories/refresh-token-repository';

import { PrismaService } from '../prisma.service';
import { PrismaRefreshTokenMapper } from '../mappers/prisma-refresh-token-mapper';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { TokenExpiredError } from '../errors/token-expired.error';

interface GetPageParams {
  size: number;
  page: number;
  where?: Prisma.RefreshTokenWhereInput;
}

const globalInclude = {
  user: true,
};

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async findManyByUser(user: User, pageable: Pageable) {
    return this.getPage({
      ...pageable,

      where: {
        userId: user.id,
      },
    });
  }

  async findById(id: string) {
    return this.findBy('id', id);
  }

  async findByToken(token: string) {
    return this.findBy('token', token);
  }

  async create(refreshToken: RefreshToken) {
    const data = PrismaRefreshTokenMapper.toPrisma(refreshToken);

    await this.prisma.refreshToken.create({ data });
  }

  async delete(refreshToken: RefreshToken) {
    await this.prisma.refreshToken.delete({
      where: {
        token: refreshToken.token,
      },
    });
  }

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

    const isSamePassword = user && (await compare(password, user.password));

    if (!isSamePassword) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  private async getPage({ page, size, where }: GetPageParams) {
    const start = size * (page - 1);
    const end = start + size;

    const rawRefreshTokens = await this.prisma.refreshToken.findMany({
      skip: start,
      take: end,

      where,

      include: globalInclude,
    });

    const total = await this.prisma.refreshToken.count({ where });

    const data = rawRefreshTokens.map(PrismaRefreshTokenMapper.toDomain);

    return {
      data,
      total,
      page,
      size,
      hasNext: total > end,
    };
  }

  private async findBy(by: 'id' | 'token', value: string) {
    const rawRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { [by]: value },
      include: globalInclude,
    });

    if (!rawRefreshToken) {
      return null;
    }

    return PrismaRefreshTokenMapper.toDomain(rawRefreshToken);
  }
}
