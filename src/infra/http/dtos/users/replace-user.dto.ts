import { IsNotEmpty, IsStrongPassword, Length } from 'class-validator';

export class ReplaceUserDTO {
  @IsNotEmpty()
  @Length(5)
  name: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
