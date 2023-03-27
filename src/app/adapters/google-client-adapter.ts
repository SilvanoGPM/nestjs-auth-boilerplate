export interface Payload {
  name?: string;
  email?: string;
  picture?: string;
}

export interface Ticket {
  getPayload: () => Payload | undefined;
}

export interface VerifyIdTokenParams {
  idToken: string;
  audience?: string;
}

export abstract class GoogleClientAdapter {
  abstract verifyIdToken(params: VerifyIdTokenParams): Promise<Ticket>;
}
