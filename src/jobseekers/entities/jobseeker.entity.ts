import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Resume } from './resume.entity';
import { JobApplication } from './application.entity';
import { SavedJob } from './saved-job.entity';
import { InterviewPreference } from './interview-preference.entity';
import { EducationHistory } from './education.entity';
import { WorkExperience } from './experience.entity';
import { SkillTag } from './skill.entity';
import { InterviewInvitation } from './interview-invitation.entity';
import { JobAlert } from './job-alert.entity';
import { Job } from 'src/companies/entities/job.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class JobSeeker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true })
  user_id: number;

  @ManyToOne(() => User, (user) => user.jobSeekers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  jobseeker_name: string;

  @Column()
  jobseeker_email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ default: 'jobSeeker' })
  accountType: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  headline: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  current_status: string;

  @Column({ nullable: true })
  preferred_location: string;

  @Column({ type: 'float', nullable: true })
  expected_salary: number;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  portfolios: { id: number; title: string; url: string; description: string }[];

  @Column({ type: 'jsonb', nullable: true, default: [] })
  socialLinks: { platform: string; url: string }[];

  @OneToMany(() => Resume, (resume) => resume.jobSeeker)
  resumes: Resume[];

  @OneToMany(() => JobApplication, (application) => application.jobSeeker)
  @JoinColumn({ name: 'user_id' })
  applications: JobApplication[];

  @OneToMany(() => SavedJob, (savedJob) => savedJob.jobSeeker)
  savedJobs: SavedJob[];

  @OneToOne(() => InterviewPreference, (preference) => preference.jobSeeker)
  @JoinColumn()
  interviewPreference: InterviewPreference;

  @OneToMany(() => EducationHistory, (education) => education.jobSeeker)
  educationHistory: EducationHistory[];

  @OneToMany(() => WorkExperience, (experience) => experience.jobSeeker)
  workExperience: WorkExperience[];

  @OneToMany(() => SkillTag, (skill) => skill.jobSeeker)
  skillTags: SkillTag[];

  @OneToMany(() => InterviewInvitation, (invitation) => invitation.jobSeeker)
  interviewInvitations: InterviewInvitation[];

  @OneToMany(() => JobAlert, (alert) => alert.jobSeeker)
  jobAlerts: JobAlert[];

  @ManyToMany(() => Job, (job) => job.jobSeekers)
  jobs: Job[];
}
