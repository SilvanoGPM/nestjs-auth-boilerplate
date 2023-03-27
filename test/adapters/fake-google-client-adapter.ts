import {
  GoogleClientAdapter,
  Ticket,
} from '@app/adapters/google-client-adapter';

import { makeUser } from '@test/factories/user-factory';

export class FakeGoogleClientAdapter implements GoogleClientAdapter {
  async verifyIdToken(): Promise<Ticket> {
    const user = makeUser();

    return {
      getPayload() {
        return {
          name: user.name,
          email: user.email,
          picture: String(user.picture),
        };
      },
    };
  }
}
