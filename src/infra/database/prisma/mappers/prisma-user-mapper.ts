import { User as PrismaUser } from '@prisma/client';
import { hashSync } from 'bcrypt';

import { User } from '@app/entities/user';

export class PrismaUserMapper {
  static toDomain(rawUser: PrismaUser) {
    return new User({
      id: rawUser.id,
      createdAt: rawUser.createdAt.toISOString(),
      updatedAt: rawUser.updatedAt.toISOString(),
      email: rawUser.email,
      password: rawUser.password,
      name: rawUser.name,
      role: rawUser.role,
      provider: rawUser.provider,
      picture: rawUser.picture,
    });
  }

  static toPrisma(user: User) {
    return {
      id: user.id,
      email: user.email,
      password: hashSync(user.password, 10),
      name: user.name,
      role: user.role,
      provider: user.provider,
      picture: user.picture,
    };
  }
}
