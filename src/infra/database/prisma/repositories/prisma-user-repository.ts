import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { User } from '@app/entities/user';
import { Pageable } from '@app/repositories/pages.type';
import { UserRepository } from '@app/repositories/user-repository';

import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';

interface GetPageParams {
  size: number;
  page: number;
  where?: Prisma.UserWhereInput;
}

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findMany(pageable: Pageable) {
    return this.getPage(pageable);
  }

  async findByEmail(email: string) {
    return this.findBy('email', email);
  }

  async findById(id: string) {
    return this.findBy('id', id);
  }

  async existsByEmail(email: string) {
    const exists = await this.findBy('email', email);

    return Boolean(exists);
  }

  async create(user: User) {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({ data });
  }

  async save(user: User) {
    const data = PrismaUserMapper.toPrisma(user);

    const exists = await this.findById(user.id);

    if (!exists) {
      return false;
    }

    await this.prisma.user.update({ data, where: { id: user.id } });

    return true;
  }

  private async getPage({ page, size, where }: GetPageParams) {
    const start = size * (page - 1);
    const end = start + size;

    const rawUsers = await this.prisma.user.findMany({
      skip: start,
      take: end,

      where,
    });

    const total = await this.prisma.user.count({ where });

    const data = rawUsers.map(PrismaUserMapper.toDomain);

    return {
      data,
      total,
      page,
      size,
      hasNext: total > end,
    };
  }

  private async findBy(by: 'email' | 'id', value: string) {
    const rawUser = await this.prisma.user.findUnique({
      where: { [by]: value },
    });

    if (!rawUser) {
      return null;
    }

    return PrismaUserMapper.toDomain(rawUser);
  }
}
