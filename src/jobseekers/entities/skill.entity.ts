import { BaseEntity } from 'src/database/base.entity';
import { JobSeeker } from 'src/jobseekers/entities/jobseeker.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('skill_tags')
export class SkillTag extends BaseEntity {


  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.skillTags, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @Column()
   job_seeker_id: number;

  @Column()
  skill_name: string;

  @Column({ default: 0 })
  endorsements_count: number;
}
