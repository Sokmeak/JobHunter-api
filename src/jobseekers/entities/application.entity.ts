import { BaseEntity } from 'src/database/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobSeeker } from './jobseeker.entity';
import { Job } from 'src/companies/entities/job.entity';

@Entity('job_applications')
export class JobApplication extends BaseEntity {
  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @Column()
  job_id: number;

  // job_application.entity.ts
  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' }) // IMPORTANT
  jobSeeker: JobSeeker;

  @Column()
  user_id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  currentJobTitle: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  portfolioUrl: string;

  @Column('text', { nullable: true })
  additionalInfo: string;

  @Column({ nullable: true })
  resumeFileName: string;

  @Column({ nullable: true })
  resumeFilePath: string;

  @Column({ nullable: true })
  resumeFileType: string;

  @Column({ nullable: true })
  resumeFileSize: number;

  @Column({
    type: 'enum',
    enum: [
      'idle',
      'submitting',
      'submitted',
      'reviewed',
      'interview',
      'decision',
    ],
    default: 'idle',
  })
  status: string;
}
