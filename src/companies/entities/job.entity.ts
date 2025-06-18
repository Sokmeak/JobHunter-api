import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './company.entity';
import { JobApplication } from './job-application.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @ManyToOne(() => Company, (company) => company.jobs, { onDelete: 'CASCADE' })
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

  @OneToMany(() => JobApplication, (application) => application.job, {
    cascade: true,
  })
  applications: JobApplication[];

  // Who You Are
  @Column({ type: 'text', array: true, nullable: true })
  who_you_are: string[];

  // Nice-To-Haves
  @Column({ type: 'text', array: true, nullable: true })
  nice_to_haves: string[];

  // Perks & Benefits
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
  };

  // Added field to track who created the job
  @Column({ length: 100, nullable: true })
  created_by: string;
}