import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  responsibility?: string;

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsString()
  job_type?: string;

  @IsOptional()
  @IsString()
  skill_required?: string;

  @IsOptional()
  @IsString()
  salary_range?: string;

  @IsOptional()
  @IsDateString()
  expired_date?: string;

  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;
}