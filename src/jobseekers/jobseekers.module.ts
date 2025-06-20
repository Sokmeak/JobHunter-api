import { Module } from '@nestjs/common';
import { JobSeekersController } from './jobseekers.controller';
import { JobSeekersService } from './jobseekers.service';
import { ConfigModule } from '@nestjs/config';
import { Company } from 'src/companies/entities/company.entity';
import { Job } from './entities/job.entity';
import { JobAlert } from './entities/job-alert.entity';
import { InterviewInvitation } from './entities/interview-invitation.entity';
import { SkillTag } from './entities/skill.entity';
import { Notification_Applicant } from './entities/notification.entity';
import { WorkExperience } from './entities/experience.entity';
import { EducationHistory } from './entities/education.entity';
import { InterviewPreference } from './entities/interview-preference.entity';
import { Resume } from './entities/resume.entity';
import { JobSeeker } from './entities/jobseeker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { SavedJob } from './entities/saved-job.entity';
import { JobApplication } from './entities/application.entity';
import { JwtService } from '@nestjs/jwt';

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
      Notification_Applicant,
      InterviewInvitation,
      JobAlert,
      Job,
      Company,
    ]),
    ConfigModule,
  ],
  controllers: [JobSeekersController],
  providers: [JobSeekersService, FilesService, JwtService],
  exports: [JobSeekersService],
})
export class JobSeekersModule {}
