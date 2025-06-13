import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateInterviewPreferenceDto {
  @IsArray()
  @IsOptional()
  available_days?: string[];

  @IsArray()
  @IsOptional()
  preferred_time_slots?: string[];

  @IsString()
  @IsOptional()
  interview_mode?: string;
}
