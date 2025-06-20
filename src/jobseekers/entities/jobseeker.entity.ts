import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { EducationHistory } from './education.entity';
import { WorkExperience } from './experience.entity';
import { SkillTag } from './skill.entity';
import { InterviewInvitation } from './interview-invitation.entity';
import { JobAlert } from './job-alert.entity';
import { InterviewPreference } from './interview-preference.entity';
import { BaseEntity } from 'src/database/base.entity';
import { Resume } from './resume.entity';
import { SavedJob } from './saved-job.entity';
import { JobApplication } from './application.entity';

@Entity('job_seekers')
export class JobSeeker extends BaseEntity {
  constructor(partial?: Partial<JobSeeker>) {
    super();
    Object.assign(this, partial);
  }

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  jobseeker_name: string;

  @Column()
  jobseeker_email: string;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  headline: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  current_status: string;

  @Column({ nullable: true })
  preferred_location: string;

  @Column({ type: 'integer', nullable: true })
  expected_salary: number;

  @OneToMany(() => Resume, (resume) => resume.jobSeeker, { cascade: true })
  resumes: Resume[];

  @OneToMany(() => JobApplication, (application) => application.jobSeeker, {
    cascade: true,
  })
  applications: JobApplication[];

  @OneToMany(() => SavedJob, (savedJob) => savedJob.jobSeeker, {
    cascade: true,
  })
  savedJobs: SavedJob[];

  @OneToOne(() => InterviewPreference, (preference) => preference.jobSeeker, {
    cascade: true,
  })
  @JoinColumn({ name: 'jobseeker_id' })
  interviewPreference: InterviewPreference;

  @OneToMany(() => EducationHistory, (education) => education.jobSeeker, {
    cascade: true,
  })
  educationHistory: EducationHistory[];

  @OneToMany(() => WorkExperience, (experience) => experience.jobSeeker, {
    cascade: true,
  })
  workExperience: WorkExperience[];

  @OneToMany(() => SkillTag, (skill) => skill.jobSeeker, { cascade: true })
  skillTags: SkillTag[];

  @OneToMany(() => InterviewInvitation, (invitation) => invitation.jobSeeker, {
    cascade: true,
  })
  interviewInvitations: InterviewInvitation[];

  @OneToMany(() => JobAlert, (alert) => alert.jobSeeker, { cascade: true })
  jobAlerts: JobAlert[];
}
