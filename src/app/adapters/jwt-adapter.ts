import { User } from '../entities/user';

export interface JWTPayload {
  sub: string;
}

export abstract class JWTAdapter {
  abstract sign(
    payload: JWTPayload,
    expiresIn?: string | number,
  ): Promise<string>;

  abstract verify(token: string): Promise<JWTPayload>;
  abstract validateUser(email: string, password: string): Promise<User | null>;
}
