import { IsString } from 'class-validator';

export class CreateSkillTagDto {
  @IsString()
  skill_name: string;
}
