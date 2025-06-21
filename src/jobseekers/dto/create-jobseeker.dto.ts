import { IsString, IsOptional, IsInt, Min, IsNumber, IsArray } from 'class-validator';

export class CreateJobSeekerDto {
  @IsInt()
  user_id: number;

  @IsString()
  @IsOptional()
  jobseeker_name?: string;

  @IsString()
  @IsOptional()
  jobseeker_email?: string;

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

  @IsInt()
  @Min(0)
  @IsOptional()
  expected_salary?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  jobIds?: number[];
}