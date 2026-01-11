import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  username: string;

  @IsString()
  role: string;

  // Only for employer
  @IsOptional()
  @IsString()
  companyName: string;
  @IsOptional()
  @IsString()
  companySize: string;
  @IsOptional()
  @IsString()
  websiteUrl: string;
}
