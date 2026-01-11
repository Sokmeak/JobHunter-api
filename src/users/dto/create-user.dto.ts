import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  IsStrongPassword,
  Min,
  MinLength,
  IsOptional,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols.',
    },
  )
  password: string;

  @IsInt()
  @IsNotEmpty()
  roleId: number;

  //Only for employer
  @IsOptional()
  companyName?: string;
  @IsOptional()
  companySize?: string;
  @IsOptional()
  websiteUrl?: string;
}
