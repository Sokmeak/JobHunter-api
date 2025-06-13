import { BaseEntity } from 'src/database/base.entity';
import { JobSeeker } from 'src/jobseekers/entities/jobseeker.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('job_alerts')
export class JobAlert extends BaseEntity {


  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.jobAlerts, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @Column()
  job_seeker_id: string;

  @Column('simple-array', { nullable: true })
  keywords: string[];

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  job_type: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ type: 'integer', nullable: true })
  min_salary: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
