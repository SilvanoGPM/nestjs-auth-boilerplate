import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { GetRefreshTokenByTokenUseCase } from '@app/use-cases/refresh-tokens/get-refresh-token-by-token-use-case';

interface JwtPayload {
  sub: string;
  jti: string;
}

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private getRefreshToken: GetRefreshTokenByTokenUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { refreshToken } = await this.getRefreshToken.execute(payload.sub);

    if (!refreshToken || refreshToken.token !== payload.jti) {
      throw new Error('Invalid token');
    }

    return refreshToken;
  }
}
