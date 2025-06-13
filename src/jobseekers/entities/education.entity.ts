import { BaseEntity } from 'src/database/base.entity';
import { JobSeeker } from 'src/jobseekers/entities/jobseeker.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('education_history')
export class EducationHistory extends BaseEntity {


  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.educationHistory, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @Column()
  job_seeker_id: string;

  @Column()
  institution_name: string;

  @Column()
  degree: string;

  @Column()
  field_of_study: string;

  @Column()
  start_year: number;

  @Column({ nullable: true })
  end_year: number;

  @Column({ nullable: true })
  grade: string;
}
