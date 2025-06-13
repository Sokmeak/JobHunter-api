import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  userId: number;

  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  website_url: string;

  @IsString()
  @IsOptional()
  founded_date: string;

  @IsString()
  @IsOptional()
  brand_logo: string;

  @IsString()
  employee_count: string;

  @IsString()
  @IsOptional()
  industry: string;

  @IsString()
  @IsOptional()
  office_location: string;

  @IsOptional()
  @IsString()
  twitter_url?: string;

  @IsOptional()
  @IsString()
  facebook_url?: string;

  @IsOptional()
  @IsString()
  linked_url?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  hr_contact_name: string;

  @IsEmail()
  @IsOptional()
  hr_contact_email: string;

  @IsString()
  @IsOptional()
  headquarters_location: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
