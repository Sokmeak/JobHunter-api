// job.entity.ts (assumed for reference)
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';
import { Company } from 'src/companies/entities/company.entity';
import { IsString } from 'class-validator';

@Entity('jobs')
export class Job extends BaseEntity {
    
  @IsString()
  title: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @Column()
  company_id: string;

  @Column()
  location: string;

  @Column({ type: 'integer', nullable: true })
  salary_min: number;

  @Column({ type: 'integer', nullable: true })
  salary_max: number;

  @Column()
  job_type: string;

  @Column()
  industry: string;

  @Column('text')
  description: string;

  @Column('simple-array', { nullable: true })
  required_skills: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
