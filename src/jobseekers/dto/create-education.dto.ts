import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateEducationHistoryDto {
  @IsString()
  institution_name: string;

  @IsString()
  degree: string;

  @IsString()
  field_of_study: string;

  @IsInt()
  start_year: number;

  @IsInt()
  @IsOptional()
  end_year?: number;

  @IsString()
  @IsOptional()
  grade?: string;
}
