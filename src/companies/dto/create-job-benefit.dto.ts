import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateJobBenefitDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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
