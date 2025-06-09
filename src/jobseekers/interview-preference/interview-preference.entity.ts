import { BaseEntity } from 'src/database/base.entity';
import { JobSeeker } from 'src/jobseekers/entities/jobseeker.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity('interview_preferences')
export class InterviewPreference extends BaseEntity {

  @OneToOne(() => JobSeeker, (jobSeeker) => jobSeeker.interviewPreference, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @Column()
  job_seeker_id: string;

  @Column('simple-array', { nullable: true })
  available_days: string[];

  @Column('simple-array', { nullable: true })
  preferred_time_slots: string[];

  @Column({ nullable: true })
  interview_mode: string;
}
