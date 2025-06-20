import { IsString, IsOptional, IsInt, Min, IsNumber } from 'class-validator';

export class CreateJobSeekerDto {
  @IsNumber()
  userId: number;

  @IsString()
  jobseeker_name: string;

  @IsString()
  jobseeker_email: string;

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
}
