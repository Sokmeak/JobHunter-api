import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateSkillTagDto {
  @IsString()
  skill_name: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  endorsements_count?: number;
}
