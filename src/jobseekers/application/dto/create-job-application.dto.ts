import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateJobApplicationDto {
  @IsString()
  job_id: string;

  @IsString()
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  currentjob?: string;

  @IsString()
  @IsOptional()
  linkedinUrl?: string;

  @IsString()
  @IsOptional()
  portfolioURL?: string;

  @IsString()
  resumePath: string;
}
