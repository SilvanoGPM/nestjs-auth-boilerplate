import {
  CreateRefreshTokenProps,
  RefreshToken,
} from '@app/entities/refresh-token';

import { InMemoryRefreshTokenRepository } from '@test/repositories/in-memory-refresh-token-repository';
import { RepositoryUtils } from '@test/utils/repository-utils';

import { generateArray } from './generic-factory';

import { makeUser } from './user-factory';

export function makeRefreshToken(
  refreshToken: Partial<CreateRefreshTokenProps> = {},
) {
  return new RefreshToken({
    id: refreshToken.id ?? 'test-id',
    createdAt: refreshToken.createdAt ?? 'test-created-at',
    updatedAt: refreshToken.updatedAt ?? 'test-updated-at',
    token: refreshToken.token ?? 'test-token',
    browser: refreshToken.browser ?? 'test-browser',
    os: refreshToken.os ?? 'test-os',
    user: refreshToken.user ?? makeUser(),
  });
}

const defaultMap = (i: number) => {
  return {
    token: `Test Token #${i}`,
  };
};

export function generateRefreshTokens(
  total = 100,
  map: (i: number) => Partial<CreateRefreshTokenProps> = defaultMap,
) {
  return generateArray((i) => {
    const id = String(i);

    const props = map(i);

    return makeRefreshToken({ id, ...props });
  }, total);
}

export function makeRepository(refreshTokens: RefreshToken[] = []) {
  const utils = new RepositoryUtils<RefreshToken>();

  return new InMemoryRefreshTokenRepository(refreshTokens, utils);
}
