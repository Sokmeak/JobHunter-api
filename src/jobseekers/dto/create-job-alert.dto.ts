import { IsString, IsArray, IsOptional, IsInt, Min } from 'class-validator';

export class CreateJobAlertDto {
  @IsArray()
  @IsOptional()
  keywords?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  job_type?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  min_salary?: number;
}
