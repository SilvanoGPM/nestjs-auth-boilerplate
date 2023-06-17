import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class ReplaceUserDTO {
  @IsNotEmpty()
  @Length(5)
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  picture?: string | null;
}
