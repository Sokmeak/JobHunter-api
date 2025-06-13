import { JobSeeker } from '../entities/jobseeker.entity';
import { Job } from 'src/jobseekers/entities/job.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';

@Entity('job_applications')
export class JobApplication extends BaseEntity {
  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.applications, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @Column()
  job_seeker_id: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  job: Job;

  @Column()
  job_id: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  currentjob: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  portfolioURL: string;

  @Column()
  resumePath: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_at: Date;

  @Column({ default: 'pending' }) // Added status field
  status: string; // e.g., pending, reviewed, accepted, rejected
}
