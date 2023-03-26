import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
