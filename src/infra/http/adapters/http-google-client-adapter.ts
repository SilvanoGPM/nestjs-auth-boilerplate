import { OAuth2Client } from 'google-auth-library';

import {
  GoogleClientAdapter,
  VerifyIdTokenParams,
} from '@app/adapters/google-client-adapter';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

export class HTTPGoogleClientAdapter implements GoogleClientAdapter {
  async verifyIdToken(params: VerifyIdTokenParams) {
    return googleClient.verifyIdToken(params);
  }
}
