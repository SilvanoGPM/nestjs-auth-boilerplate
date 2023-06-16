import {
  Body,
  Controller,
  UnauthorizedException,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Get,
  Query,
  UseGuards,
  Delete,
  Param,
  ForbiddenException,
} from '@nestjs/common';

import { Request } from 'express';
import * as DeviceDetector from 'device-detector-js';

import { LoginUseCase } from '@app/use-cases/refresh-tokens/login-use-case';
import { RefreshAccessTokenUseCase } from '@app/use-cases/refresh-tokens/refresh-access-token-use-case';
import { TokenExpiredError } from '@infra/database/prisma/errors/token-expired.error';
import { User } from '@app/entities/user';
import { GetRefreshTokensByUserUseCase } from '@app/use-cases/refresh-tokens/get-refresh-tokens-by-user-use-case';
import { Pageable } from '@app/repositories/pages.type';
import { RevokeRefreshTokenUseCase } from '@app/use-cases/refresh-tokens/revoke-refresh-token-use-case';
import { InsufficientPermissionError } from '@app/use-cases/errors/insufficient-permission.error';
import { GoogleLoginUseCase } from '@app/use-cases/refresh-tokens/google-login-use-case';

import { LoginDTO } from '../dtos/refresh-tokens/login.dto';
import { RefreshTokenDTO } from '../dtos/refresh-tokens/refresh-token.dto';
import { RefreshTokenExpiredError } from '../errors/refresh-token-expired.error';
import { GenericService } from '../services/generic.service';
import { CurrentUser } from '../auth/guards/current-user.guard';
import { IsUser } from '../auth/guards/is-user.guard';
import { RefreshTokenNotFoundError } from '../errors/refresh-token-not-found.error';

@Controller('auth')
export class AuthController {
  private deviceDetector = new DeviceDetector();

  constructor(
    private loginOnLocal: LoginUseCase,
    private loginWithGoogle: GoogleLoginUseCase,
    private getRefreshTokensByUser: GetRefreshTokensByUserUseCase,
    private refreshAccessToken: RefreshAccessTokenUseCase,
    private revokeRefreshToken: RevokeRefreshTokenUseCase,
    private genericService: GenericService,
  ) {}

  @Get('/tokens')
  @UseGuards(IsUser)
  async getAllTokens(@CurrentUser() user: User, @Query() query: Pageable) {
    const params = this.genericService.getPageParamsByQuery(query);

    const { tokens } = await this.getRefreshTokensByUser.execute({
      email: user.email,
      ...params,
    });

    return tokens;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async localLogin(@Body() loginDto: LoginDTO, @Req() req: Request) {
    const userAgent = this.deviceDetector.parse(
      req.headers['user-agent'] || '',
    );

    const { email, password } = loginDto;

    try {
      const data = await this.loginOnLocal.execute({
        email,
        password,
        browser: userAgent.client?.name,
        os: userAgent.os?.name,
      });

      return data;
    } catch (error: any) {
      throw new UnauthorizedException(
        process.env.UNAUTHORIZARED_ERROR_MESSAGE || 'Unauthorized',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }

  @Post('login/google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body('token') token: string, @Req() req: Request) {
    const userAgent = this.deviceDetector.parse(
      req.headers['user-agent'] || '',
    );

    try {
      const data = await this.loginWithGoogle.execute({
        token,
        browser: userAgent.client?.name,
        os: userAgent.os?.name,
      });

      return data;
    } catch (error: any) {
      throw new UnauthorizedException(
        process.env.UNAUTHORIZARED_ERROR_MESSAGE || 'Unauthorized',
        {
          cause: error,
          description: error.message,
        },
      );
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async _refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDTO) {
    try {
      const { accessToken } = await this.refreshAccessToken.execute(
        refreshTokenDto.token,
      );

      return { accessToken };
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        throw new RefreshTokenExpiredError(error);
      } else {
        throw new UnauthorizedException(
          process.env.UNAUTHORIZARED_ERROR_MESSAGE || 'Unauthorized',
          {
            cause: error,
            description: error.message,
          },
        );
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(IsUser)
  async revoke(@CurrentUser() user: User, @Param('id') id: string) {
    try {
      await this.revokeRefreshToken.execute(id, user);
    } catch (error) {
      if (error instanceof InsufficientPermissionError) {
        throw new ForbiddenException(
          process.env.FORBIDDEN_ERROR_MESSAGE || 'Forbidden',
          {
            cause: error,
            description: error.message,
          },
        );
      }

      throw new RefreshTokenNotFoundError(error);
    }
  }
}
