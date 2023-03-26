import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PromoteUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  role: string;
}
