import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { JobSeeker } from './jobseeker.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  job_seeker_id: number;

  @ManyToOne(
    () => JobSeeker,
    (jobSeeker: { portfolios: any }) => jobSeeker?.portfolios,
  )
  @JoinColumn({ name: 'job_seeker_id' })
  jobSeeker: JobSeeker;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: string;
}
