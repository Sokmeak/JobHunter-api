// interview-invitation.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { JobSeeker } from './jobseeker.entity';
import { Job } from './job.entity';
import { Company } from 'src/companies/entities/company.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('interview_invitations')
export class InterviewInvitation extends BaseEntity {
  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.interviewInvitations, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @Column()
   job_seeker_id: number;

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
