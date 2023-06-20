import {
  GoogleClientAdapter,
  Ticket,
} from '@app/adapters/google-client-adapter';

import { makeUser } from '@test/factories/user-factory';

export const DEFAULT_USER = makeUser();

export class FakeGoogleClientAdapter implements GoogleClientAdapter {
  async verifyIdToken(): Promise<Ticket> {
    return {
      getPayload() {
        return {
          name: DEFAULT_USER.name,
          email: DEFAULT_USER.email,
          picture: String(DEFAULT_USER.picture),
        };
      },
    };
  }
}
