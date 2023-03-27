export class PayloadEmptyError extends Error {
  constructor() {
    super('Google payload empty');
  }
}
