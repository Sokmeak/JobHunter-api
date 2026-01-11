import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class ScheduleInterviewDto {
  @IsDateString()
  @IsNotEmpty()
  schedule_at: string;

  @IsOptional()
  @IsString()
  interview_mode?: string;

  @IsOptional()
  @IsString()
  interviewer_name?: string;

  @IsOptional()
  @IsString()
  interview_link?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
