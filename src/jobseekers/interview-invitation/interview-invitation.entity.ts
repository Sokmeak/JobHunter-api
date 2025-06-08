// interview-invitation.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { JobSeeker } from '../entities/jobseeker.entity';
import { Job } from '../jobs/job.entity';
import { Company } from '../companies/company.entity';

@Entity('interview_invitations')
export class InterviewInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.interviewInvitations, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @Column()
  job_seeker_id: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  job: Job;

  @Column()
  job_id: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @Column()
  company_id: string;

  @Column({ default: 'pending' })
  invitation_status: string; // pending, accepted, rejected

  @Column({ type: 'timestamp', nullable: true })
  interview_date: Date;

  @Column({ nullable: true })
  interview_mode: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
