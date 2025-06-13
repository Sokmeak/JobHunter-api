import { BaseEntity } from 'src/database/base.entity';
import { JobSeeker } from 'src/jobseekers/entities/jobseeker.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('work_experience')
export class WorkExperience extends BaseEntity{


  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.workExperience, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @Column()
  job_seeker_id: string;

  @Column()
  company_name: string;

  @Column()
  job_title: string;

  @Column()
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  @Column('text')
  responsibilities: string;
}
