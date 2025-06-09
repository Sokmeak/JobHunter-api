import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { JobApplication } from '../application/application.entity';
import { EducationHistory } from '../education/education.entity';
import { WorkExperience } from '../experience/experience.entity';
import { SkillTag } from '../skill/skill.entity';
import { InterviewInvitation } from '../interview-invitation/interview-invitation.entity';
import { JobAlert } from '../job-alert/job-alert.entity';
import { Resume } from '../resume/resume.entity';
import { InterviewPreference } from '../interview-preference/interview-preference.entity';
import { SavedJob } from '../save-job/saved-job.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('job_seekers')
export class JobSeeker extends BaseEntity {
  

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

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
