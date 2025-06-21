import {
  IsString,
  IsInt,
  IsArray,
  IsObject,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateJobDto {
  @IsInt()
  company_id: number;

  @IsInt()
  created_by: number;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  responsibility?: string[];

  @IsString()
  @IsOptional()
  qualification?: string;

  @IsString()
  @IsOptional()
  job_type?: string;

  @IsString()
  @IsOptional()
  skill_required?: string;

  @IsString()
  @IsOptional()
  salary_range?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsOptional()
  capacity?: number;

  @IsDateString()
  @IsOptional()
  posted_at?: string;

  @IsDateString()
  @IsOptional()
  expired_date?: string;

  @IsBoolean()
  @IsOptional()
  is_visible?: boolean;

  @IsInt()
  @IsOptional()
  views?: number;

  @IsInt()
  @IsOptional()
  applicant_applied?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  who_you_are?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  nice_to_haves?: string[];

  @IsString()
  @IsOptional()
  level: string;

  @IsObject()
  @IsOptional()
  perks_benefits?: {
    health_coverage?: string;
    learning_stipend?: string;
    flexible_hours?: string;
    team_retreats?: string;
    retirement_plan?: string;
    paid_time_off?: string;
    remote_work?: string;
    bonus_incentives?: string;
    stock_options?: string;
    wellness_program?: string;
    parental_leave?: string;
    commuter_benefits?: string;
    relocation_assistance?: string;
    professional_development?: string;
    employee_discounts?: string;
    tool_access?: string;
  };
}
