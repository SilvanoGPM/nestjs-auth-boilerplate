import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { GetAllUsersUseCase } from '@app/use-cases/users/get-all-users-use-case';
import { GetUserByEmailUseCase } from '@app/use-cases/users/get-user-by-email-use-case';
import { CreateUserUseCase } from '@app/use-cases/users/create-user-use-case';
import { UserExistsByEmailUseCase } from '@app/use-cases/users/user-exists-by-email-use-case';
import { SearchUsersUseCase } from '@app/use-cases/users/search-users-use-case';
import { GetUserByIdUseCase } from '@app/use-cases/users/get-user-by-id-use-case';
import { ReplaceUserUseCase } from '@app/use-cases/users/replace-user-use-case';
import { PromoteUserUseCase } from '@app/use-cases/users/promote-user-use-case';
import { User } from '@app/entities/user';
import { GenericService } from '../services/generic.service';

import {
  generateUsers,
  makeRepository,
  makeUser,
} from '@test/factories/user-factory';

import { UserController } from './user.controller';
import { UserRepository } from '@app/repositories/user-repository';
import { UserNotFoundError } from '../errors/user-not-found.error';

describe('UserController', () => {
  const userRepository = makeRepository();

  let userController: UserController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserRepository,
          useValue: userRepository,
        },

        GenericService,
        GetAllUsersUseCase,
        SearchUsersUseCase,
        GetUserByEmailUseCase,
        GetUserByIdUseCase,
        CreateUserUseCase,
        ReplaceUserUseCase,
        PromoteUserUseCase,
        UserExistsByEmailUseCase,
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  afterEach(() => {
    userRepository.users = [];
  });

  describe('getAll', () => {
    it('should be able to get all users with pagination', async () => {
      const TOTAL_ELEMENTS = 100;

      userRepository.users = generateUsers(TOTAL_ELEMENTS);

      const params = {
        page: 1,
        size: 10,
      };

      const users = await userController.getAll(params);

      expect(users).toBeTruthy();
      expect(users.hasNext).toBeTruthy();
      expect(users.page).toEqual(params.page);
      expect(users.size).toEqual(params.size);
      expect(users.total).toEqual(TOTAL_ELEMENTS);

      expect(users.data).toHaveLength(params.size);
      expect(users.data[0]).toBeInstanceOf(User);
    });
  });

  describe('search', () => {
    it('should be able to search all users with pagination when search not send', async () => {
      const TOTAL_ELEMENTS = 100;

      userRepository.users = generateUsers(TOTAL_ELEMENTS);

      const params = {
        page: 1,
        size: 10,
      };

      const users = await userController.search(params);

      expect(users).toBeTruthy();
      expect(users.hasNext).toBeTruthy();
      expect(users.page).toEqual(1);
      expect(users.size).toEqual(10);
      expect(users.total).toEqual(TOTAL_ELEMENTS);

      expect(users.data).toHaveLength(10);
      expect(users.data[0]).toBeInstanceOf(User);
    });

    it('should be able to search users with pagination', async () => {
      const TOTAL_OF_USERS_WITH_TEN_ON_NAME = 2;

      userRepository.users = generateUsers();

      const params = {
        page: 1,
        size: 10,
        name: '10',
      };

      const users = await userController.search(params);

      expect(users).toBeTruthy();
      expect(users.hasNext).toBeFalsy();
      expect(users.page).toEqual(params.page);
      expect(users.size).toEqual(params.size);
      expect(users.total).toEqual(TOTAL_OF_USERS_WITH_TEN_ON_NAME);

      expect(users.data).toHaveLength(TOTAL_OF_USERS_WITH_TEN_ON_NAME);
      expect(users.data[0]).toBeInstanceOf(User);
    });
  });

  describe('me', () => {
    it('should be able to return actual user', async () => {
      const initialUser = makeUser();

      const me = await userController.me(initialUser);

      expect(me).toEqual(initialUser);
    });
  });

  describe('getByEmail', () => {
    it('should be able to get an user', async () => {
      const initialUser = makeUser();

      userRepository.users.push(initialUser);

      const { user } = await userController.getByEmail(initialUser.email);

      expect(user).toBeInstanceOf(User);
      expect(user).toEqual(initialUser);
    });

    it('should not be able to get an user when it does not exists', async () => {
      expect(() => {
        return userController.getByEmail('random-email');
      }).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('existsByEmail', () => {
    it('should be able to get true when user exists', async () => {
      const initialUser = makeUser();

      userRepository.users.push(initialUser);

      const { exists } = await userController.existsByEmail(initialUser.email);

      expect(exists).toBeTruthy();
    });

    it('should be able to get false when not user exists', async () => {
      const initialUser = makeUser();

      const { exists } = await userController.existsByEmail(initialUser.email);

      expect(exists).toBeFalsy();
    });
  });

  describe('create', () => {
    it('should be able to create an user', async () => {
      const params = {
        name: 'test-user',
        email: 'test-email',
        role: 'test-role',
        password: 'test-password',
        phone: 'test-phone',
        cpf: 'test-cpf',
        picture: 'test-picture',
      };

      const { user } = await userController.create(params);

      expect(userRepository.users).toHaveLength(1);
      expect(userRepository.users[0]).toEqual(user);
      expect(user).toBeInstanceOf(User);
    });

    it('should not be able to create an user when email already in use', async () => {
      const initialUser = makeUser();

      userRepository.users.push(initialUser);

      const params = {
        email: initialUser.email,
        name: 'test-user',
        role: 'test-role',
        password: 'test-password',
        phone: 'test-phone',
        cpf: 'test-cpf',
        picture: 'test-picture',
      };

      expect(() => {
        return userController.create(params);
      }).rejects.toThrow(BadRequestException);
    });
  });

  describe('replace', () => {
    it('should be able to replace an user', async () => {
      const initialUser = makeUser();

      userRepository.users.push(initialUser);

      const params = {
        name: 'new-test-user-updated',
        picture: 'new-test-picture',
      };

      const { user } = await userController.replace(initialUser, params);

      expect(userRepository.users).toHaveLength(1);
      expect(userRepository.users[0]).toEqual(user);
      expect(initialUser.name).not.toEqual(user.name);
      expect(user).toBeInstanceOf(User);
    });

    it('should not be able to replace an user when it does not exists', async () => {
      const initialUser = makeUser();

      const params = {
        name: 'new-test-user-updated',
        picture: 'new-test-picture',
      };

      expect(() => {
        return userController.replace(initialUser, params);
      }).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('promote', () => {
    it('should be able to promote an user', async () => {
      const initialUser = makeUser();

      userRepository.users.push(initialUser);

      await userController.promote({
        email: initialUser.email,
        role: 'other-role',
      });

      expect(userRepository.users).toHaveLength(1);
      expect(userRepository.users[0]).toBeTruthy();
      expect(userRepository.users[0].role).toEqual('other-role');
    });
  });
});
