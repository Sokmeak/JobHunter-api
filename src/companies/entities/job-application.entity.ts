import { Entity, Column, ManyToOne } from 'typeorm';
import { Job } from './job.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('job_applications-company')
export class JobApplication  extends BaseEntity{


  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  job: Job;

  @Column()
  job_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  user_id: string;

  @Column({ type: 'text', nullable: true })
  cover_letter: string;

  @Column({ type: 'text', nullable: true })
  resume_url: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_at: string;
}
