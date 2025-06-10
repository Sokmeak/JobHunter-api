import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './company.entity';
import { JobApplication } from './job-application.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('jobs')
export class Job extends BaseEntity{


  @ManyToOne(() => Company, company => company.jobs, { onDelete: 'CASCADE' })
  company: Company;

  @Column()
  company_id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  responsibility: string;

  @Column({ type: 'text', nullable: true })
  qualification: string;

  @Column({ length: 100, nullable: true })
  job_type: string;

  @Column({ type: 'text', nullable: true })
  skill_required: string;

  @Column({ type: 'varchar', nullable: true })
  salary_range: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  posted_at: string;

  @Column({ type: 'timestamp', nullable: true })
  expired_date: string;

  @Column({ default: true })
  is_visible: boolean;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  applicant_applied: number;

  @OneToMany(() => JobApplication, application => application.job, { cascade: true })
  applications: JobApplication[];
}
