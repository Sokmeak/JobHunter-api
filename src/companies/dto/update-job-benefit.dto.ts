import { IsString, IsOptional, IsBoolean } from 'class-validator';
export class UpdateJobBenefitDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

