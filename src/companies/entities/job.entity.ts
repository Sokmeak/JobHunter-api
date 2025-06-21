import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Company } from './company.entity';
import { JobApplication } from './job-application.entity';
import { BaseEntity } from 'src/database/base.entity';
import { JobSeeker } from 'src/jobseekers/entities/jobseeker.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @ManyToOne(() => Company, (company) => company.jobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  company_id: number;

  @ManyToMany(() => JobSeeker, (jobSeeker) => jobSeeker.jobs, { cascade: true })
  @JoinTable({
    name: 'job_jobseeker',
    joinColumn: {
      name: 'job_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'jobseeker_id',
      referencedColumnName: 'id',
    },
  })
  jobSeekers: JobSeeker[];

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  responsibility: string[];

  @Column({ type: 'text', nullable: true })
  qualification: string;

  @Column({ type: 'varchar', nullable: true })
  level: string;

  @Column({ length: 100, nullable: true })
  job_type: string;

  @Column({ type: 'text', nullable: true })
  skill_required: string;

  @Column({ type: 'varchar', nullable: true })
  salary_range: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

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

  @OneToMany(() => JobApplication, (application) => application.job, {
    cascade: true,
  })
  applications: JobApplication[];

  @Column({ type: 'text', array: true, nullable: true })
  who_you_are: string[];

  @Column({ type: 'text', array: true, nullable: true })
  nice_to_haves: string[];

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  perks_benefits: {
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
    tool_access?: string;
  };

  @Column()
  created_by: number;
}
