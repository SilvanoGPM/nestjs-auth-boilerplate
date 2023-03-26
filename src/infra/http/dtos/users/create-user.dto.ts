import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(5)
  name: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsUrl()
  picture: string;
}
