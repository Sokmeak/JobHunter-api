import {
  IsNumber,
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsObject,
  IsDateString,
} from 'class-validator';

export class CreateJobSeekerDto {
  @IsNumber()
  user_id: number;

  @IsString()
  jobseeker_name: string;

  @IsEmail()
  jobseeker_email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  accountType?: string;

  @IsString()
  @IsOptional()
  profile_image?: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  current_status?: string;

  @IsString()
  @IsOptional()
  preferred_location?: string;

  @IsNumber()
  @IsOptional()
  expected_salary?: number;

  @IsArray()
  @IsOptional()
  portfolios?: {
    id: number;
    title: string;
    url: string;
    description: string;
  }[];

  @IsArray()
  @IsOptional()
  socialLinks?: { platform: string; url: string }[];

  @IsArray()
  @IsOptional()
  jobIds?: number[];
}
