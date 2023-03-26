import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  UseGuards,
  Patch,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { Pageable } from '@app/repositories/pages.type';
import { GetAllUsersUseCase } from '@app/use-cases/users/get-all-users-use-case';
import { User } from '@app/entities/user';
import { CreateUserUseCase } from '@app/use-cases/users/create-user-use-case';
import { UserExistsByEmailUseCase } from '@app/use-cases/users/user-exists-by-email-use-case';
import { GetUserByEmailUseCase } from '@app/use-cases/users/get-user-by-email-use-case';
import { ReplaceUserUseCase } from '@app/use-cases/users/replace-user-use-case';
import { PromoteUserUseCase } from '@app/use-cases/users/promote-user-use-case';

import { GenericService } from '../services/generic.service';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { CreateUserDTO } from '../dtos/users/create-user.dto';
import { CurrentUser } from '../auth/guards/current-user.guard';
import { IsUser } from '../auth/guards/is-user.guard';
import { IsAdmin } from '../auth/guards/is-admin.guard';
import { ReplaceUserDTO } from '../dtos/users/replace-user.dto';
import { PromoteUserDTO } from '../dtos/users/promote-user.dto';
import { UserAlreadyExists } from '../errors/user-already-exists.error';

@Controller('users')
export class UserController {
  constructor(
    private getAllUsers: GetAllUsersUseCase,
    private getUserByEmail: GetUserByEmailUseCase,
    private userExistsByEmail: UserExistsByEmailUseCase,
    private createUser: CreateUserUseCase,
    private replaceUser: ReplaceUserUseCase,
    private promoteUser: PromoteUserUseCase,
    private genericService: GenericService,
  ) {}

  @Get()
  @UseGuards(IsAdmin)
  async getAll(@Query() query: Pageable) {
    const params = this.genericService.getPageParamsByQuery(query);

    const { users } = await this.getAllUsers.execute(params);

    return users;
  }

  @Get('me')
  @UseGuards(IsUser)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get(':email')
  @UseGuards(IsAdmin)
  async getByEmail(@Param('email') email: string) {
    try {
      const { user } = await this.getUserByEmail.execute(email);

      return { user };
    } catch (error) {
      throw new UserNotFoundError(error);
    }
  }

  @Get(':email/exists')
  async existsByEmail(@Param('email') email: string) {
    const exists = await this.userExistsByEmail.execute(email);

    return { exists };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDTO) {
    const { email, password, name, picture } = createUserDto;

    const userAlreadyExists = await this.userExistsByEmail.execute(email);

    if (userAlreadyExists) {
      throw new UserAlreadyExists(email);
    }

    const user = await this.createUser.execute({
      email,
      password,
      name,
      picture: picture,
      role: 'user',
      provider: 'local',
    });

    return { user };
  }

  @Put()
  @UseGuards(IsUser)
  async replace(
    @CurrentUser() currentUser: User,
    @Body() replaceUserDto: ReplaceUserDTO,
  ) {
    try {
      const { id, email, role, picture, provider } = currentUser;

      const { user } = await this.replaceUser.execute({
        id,
        role,
        email,
        picture,
        provider,
        name: replaceUserDto.name,
        password: replaceUserDto.password,
      });

      return { user };
    } catch (error) {
      throw new UserNotFoundError(error);
    }
  }

  @Patch('promote')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(IsAdmin)
  async promote(@Body() promoteDto: PromoteUserDTO) {
    try {
      await this.promoteUser.execute(promoteDto.email, promoteDto.role);
    } catch (error) {
      throw new UserNotFoundError(error);
    }
  }
}
