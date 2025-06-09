import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { JobSeeker } from '../entities/jobseeker.entity';
import { Job } from '../jobs/job.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('saved_jobs')
export class SavedJob extends BaseEntity {
  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.savedJobs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_seeker_id' })
  jobSeeker: JobSeeker;
  @Column()
  job_seeker_id: number;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  @Column()
  job_id: string;
  job: Job;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  saved_at: Date;
}
