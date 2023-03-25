import { RefreshToken } from '@app/entities/refresh-token';
import { User } from '@app/entities/user';

import { Page, Pageable } from './pages.type';

export abstract class RefreshTokenRepository {
  abstract findManyByUser(
    user: User,
    pageable: Pageable,
  ): Promise<Page<RefreshToken>>;

  abstract findByToken(token: string): Promise<RefreshToken | null>;
  abstract findById(id: string): Promise<RefreshToken | null>;
  abstract create(refreshToken: RefreshToken): Promise<void>;
  abstract delete(refreshToken: RefreshToken): Promise<void>;
}
