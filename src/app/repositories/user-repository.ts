import { User } from '@app/entities/user';

import { Page, Pageable } from './pages.type';

export abstract class UserRepository {
  abstract findMany(pageable: Pageable): Promise<Page<User>>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<boolean>;
}
