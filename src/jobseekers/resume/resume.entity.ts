import { Entity } from 'typeorm';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { BaseEntity } from 'src/database/base.entity';
@Entity('resumes')
export class CreateResumeDto extends BaseEntity {
  @IsString()
  resume_url: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}
