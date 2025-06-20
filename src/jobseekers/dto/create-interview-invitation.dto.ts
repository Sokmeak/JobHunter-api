import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateInterviewInvitationDto {
  @IsString()
  job_id: string;

  @IsString()
  company_id: string;

  @IsDateString()
  interview_date: string;

  @IsString()
  interview_mode: string;
}
