import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobSeeker } from './jobseeker.entity';

@Entity()
export class SocialLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  job_seeker_id: number;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.socialLinks)
  @JoinColumn({ name: 'job_seeker_id' })
  jobSeeker: JobSeeker;

  @Column()
  url: string;

  @Column({ nullable: true })
  platform: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: string;
}
