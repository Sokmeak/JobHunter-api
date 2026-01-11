import {
  IsString,
  IsEmail,
  IsOptional,
  IsUrl,
  IsEnum,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateJobApplicationDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  currentJobTitle?: string;

  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @IsUrl()
  @IsOptional()
  portfolioUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  additionalInfo?: string;

  // File upload will be handled separately in the controller

  @IsOptional()
  resume?: Express.Multer.File;
}

export class JobApplicationResponseDto {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone?: string;
  currentJobTitle?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  additionalInfo?: string;
  resumeFileName?: string;
  resumeFileType?: string;
  resumeFileSize?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum JobApplicationStatus {
  IDLE = 'idle',
  SUBMITTING = 'submitting',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
  INTERVIEW = 'interview',
  DECISION = 'decision',
}
