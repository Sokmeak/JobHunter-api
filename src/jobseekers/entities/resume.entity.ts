import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { JobSeeker } from './jobseeker.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('resumes')
export class Resume extends BaseEntity {
  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.resumes, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @Column()
  job_seeker_id: string;

  @Column()
  resume_url: string;

  @Column({ default: false })
  is_primary: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
