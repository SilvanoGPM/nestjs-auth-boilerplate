import { FakeGoogleClientAdapter } from '@test/adapters/fake-google-client-adapter';
import { FakeJWTAdapter } from '@test/adapters/fake-jwt-adapter';

import {
  makeRefreshToken,
  makeRepository as makeRefreshTokenRepository,
} from '@test/factories/refresh-token-factory';

import {
  makeUser,
  makeRepository as makeUserRepository,
} from '@test/factories/user-factory';
import { PayloadEmptyError } from '../errors/payload-empty.error';
import { CreateUserUseCase } from '../users/create-user-use-case';

import { GetUserByEmailUseCase } from '../users/get-user-by-email-use-case';
import { UserExistsByEmailUseCase } from '../users/user-exists-by-email-use-case';
import { CreateRefreshTokenUseCase } from './create-refresh-token-use-case';
import { GenerateAccessTokenUseCase } from './generate-access-token-use-case';
import { GoogleLoginUseCase } from './google-login-use-case';

describe('GoogleLogin use case', () => {
  it('should be able to login with google', async () => {
    const initialToken = makeRefreshToken();

    const refreshTokenRepository = makeRefreshTokenRepository([initialToken]);

    const userRepository = makeUserRepository([makeUser()]);

    const jwtAdapter = new FakeJWTAdapter(refreshTokenRepository);

    const createRefreshToken = new CreateRefreshTokenUseCase(
      refreshTokenRepository,
    );

    const generateAccessToken = new GenerateAccessTokenUseCase(jwtAdapter);

    const getUserByEmail = new GetUserByEmailUseCase(userRepository);

    const userExistsByEmail = new UserExistsByEmailUseCase(userRepository);

    const createUser = new CreateUserUseCase(userRepository);

    const googleClientAdapter = new FakeGoogleClientAdapter();

    const googleLogin = new GoogleLoginUseCase(
      jwtAdapter,
      createRefreshToken,
      generateAccessToken,
      getUserByEmail,
      userExistsByEmail,
      createUser,
      googleClientAdapter,
    );

    const params = {
      token: 'test-token',
    };

    const { accessToken, refreshToken, name, role, email } =
      await googleLogin.execute(params);

    expect(accessToken).toEqual(initialToken.user.id);
    expect(refreshToken).toEqual(initialToken.user.id);
    expect(name).toEqual(initialToken.user.name);
    expect(email).toEqual(initialToken.user.email);
    expect(role).toEqual(initialToken.user.role);
  });

  it('should be able to login with google and create user when not exists', async () => {
    const initialToken = makeRefreshToken();

    const refreshTokenRepository = makeRefreshTokenRepository([initialToken]);

    const userRepository = makeUserRepository([]);

    const jwtAdapter = new FakeJWTAdapter(refreshTokenRepository);

    const createRefreshToken = new CreateRefreshTokenUseCase(
      refreshTokenRepository,
    );

    const generateAccessToken = new GenerateAccessTokenUseCase(jwtAdapter);

    const getUserByEmail = new GetUserByEmailUseCase(userRepository);

    const userExistsByEmail = new UserExistsByEmailUseCase(userRepository);

    const createUser = new CreateUserUseCase(userRepository);

    const googleClientAdapter = new FakeGoogleClientAdapter();

    const createUserSpy = jest.fn();
    createUserSpy.mockReturnValue({ user: makeUser() });

    createUser.execute = createUserSpy;

    const googleLogin = new GoogleLoginUseCase(
      jwtAdapter,
      createRefreshToken,
      generateAccessToken,
      getUserByEmail,
      userExistsByEmail,
      createUser,
      googleClientAdapter,
    );

    const params = {
      token: 'test-token',
    };

    const { accessToken, refreshToken, name, role, email } =
      await googleLogin.execute(params);

    expect(accessToken).toEqual(initialToken.user.id);
    expect(refreshToken).toEqual(initialToken.user.id);
    expect(name).toEqual(initialToken.user.name);
    expect(email).toEqual(initialToken.user.email);
    expect(role).toEqual(initialToken.user.role);
    expect(createUserSpy).toBeCalled();
  });

  it('should not be able to login when payload is empty', async () => {
    const initialToken = makeRefreshToken();

    const refreshTokenRepository = makeRefreshTokenRepository([initialToken]);

    const userRepository = makeUserRepository([makeUser()]);

    const jwtAdapter = new FakeJWTAdapter(refreshTokenRepository);

    const createRefreshToken = new CreateRefreshTokenUseCase(
      refreshTokenRepository,
    );

    const generateAccessToken = new GenerateAccessTokenUseCase(jwtAdapter);

    const getUserByEmail = new GetUserByEmailUseCase(userRepository);

    const userExistsByEmail = new UserExistsByEmailUseCase(userRepository);

    const createUser = new CreateUserUseCase(userRepository);

    const googleClientAdapter = new FakeGoogleClientAdapter();

    googleClientAdapter.verifyIdToken = async () => ({
      getPayload: () => undefined,
    });

    const googleLogin = new GoogleLoginUseCase(
      jwtAdapter,
      createRefreshToken,
      generateAccessToken,
      getUserByEmail,
      userExistsByEmail,
      createUser,
      googleClientAdapter,
    );

    const params = {
      token: 'test-token',
    };

    expect(() => {
      return googleLogin.execute(params);
    }).rejects.toThrow(PayloadEmptyError);
  });
});
