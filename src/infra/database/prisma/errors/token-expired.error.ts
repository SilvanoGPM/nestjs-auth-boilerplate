export class TokenExpiredError extends Error {
  constructor(expiredAt: string) {
    super(`Token expired at: ${expiredAt}`);
  }
}
