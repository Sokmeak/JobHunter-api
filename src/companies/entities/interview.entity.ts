import { Entity, Column,  ManyToOne } from 'typeorm';
import { JobApplication } from './job-application.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('interviews')
export class Interview extends BaseEntity {


  @ManyToOne(() => JobApplication, application => application.job, { onDelete: 'CASCADE' })
  jobApplication: JobApplication;

  @Column()
  job_application_id: number;

  @Column({ type: 'timestamp' })
  schedule_at: string;

  @Column({ length: 100, nullable: true })
  interview_mode: string;

  @Column({ length: 255, nullable: true })
  interviewer_name: string;

  @Column({ type: 'text', nullable: true })
  interview_link: string;

  @Column({ default: 'pending' })
  status: string;
}