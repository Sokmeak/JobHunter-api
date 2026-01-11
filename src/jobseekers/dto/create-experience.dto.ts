import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateWorkExperienceDto {
  @IsString()
  company_name: string;

  @IsString()
  job_title: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsString()
  responsibilities: string;
}
