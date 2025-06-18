import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsArray, IsObject, IsInt } from 'class-validator';

export class CreateJobDto {
  // @IsInt()
  // @IsNotEmpty()
  // company_id: number;

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

  // Who You Are
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  who_you_are?: string[];

  // Nice-To-Haves
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nice_to_haves?: string[];

  // Perks & Benefits
  @IsOptional()
  @IsObject()
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
  };

  // Created By
  @IsOptional()
  @IsString()
  created_by?: string;
}