export class InvalidProviderError extends Error {
  constructor(provider: string) {
    const formattedProvider =
      provider[0].toUpperCase() + provider.slice(1).toLowerCase();

    super(`Login available only for [${formattedProvider}] provider`);
  }
}
