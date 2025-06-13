import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateResumeDto {
  @IsString()
  resume_url: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}
