import { Module } from '@nestjs/common';
import { JobSeekersController } from './jobseekers.controller';
import { JobSeekersService } from './jobseekers.service';
import { ConfigModule } from '@nestjs/config';
import { Company } from 'src/companies/entities/company.entity';
import { Job } from './jobs/job.entity';
import { JobAlert } from './job-alert/job-alert.entity';
import { InterviewInvitation } from './interview-invitation/interview-invitation.entity';
import { SkillTag } from './skill/skill.entity';
import { Notification } from './notification/notification.entity';
import { WorkExperience } from './experience/experience.entity';
import { EducationHistory } from './education/education.entity';
import { InterviewPreference } from './interview-preference/interview-preference.entity';
import { SavedJob } from './save-job/saved-job.entity';
import { JobApplication } from './application/application.entity';
import { Resume } from './resume/resume.entity';
import { JobSeeker } from './entities/jobseeker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobSeeker,
      Resume,
      JobApplication,
      SavedJob,
      InterviewPreference,
      EducationHistory,
      WorkExperience,
      SkillTag,
      Notification,
      InterviewInvitation,
      JobAlert,
      Job,
      Company,
    ]),

    ConfigModule,
  ],

  controllers: [JobSeekersController],
  providers: [JobSeekersService, FilesService],
})
export class JobSeekersModule {}
