export class InsufficientPermissionError extends Error {
  constructor() {
    super('Permission insufficient');
  }
}
