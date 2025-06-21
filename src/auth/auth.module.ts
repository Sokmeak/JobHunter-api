import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy'; // correct path
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CompaniesService } from 'src/companies/companies.service';

import { Reflector } from '@nestjs/core';
import { BcryptProvider } from 'src/users/bcrypt.provider';
import { RolesService } from 'src/roles/roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity'; // Ensure this path is correct
import { Company } from 'src/companies/entities/company.entity';
import { Member } from 'src/companies/entities/member.entity';
import { Technology } from 'src/companies/technology/technology.entity';
import { CompanyTechStack } from 'src/companies/entities/company-tech-stack.entity';
import { OfficeLocation } from 'src/companies/entities/office-location.entity';
import { OfficeImage } from 'src/companies/entities/office-image.entity';
import { CompanyDocument } from 'src/companies/entities/company-document.entity';
import { Job } from 'src/companies/entities/job.entity';
import { JobApplication } from 'src/companies/entities/job-application.entity';
import { Interview } from 'src/companies/entities/interview.entity';

import { FilesService } from 'src/files/files.service';
import { Notification_Applicant } from 'src/jobseekers/entities/notification.entity';
import { JobSeekersService } from 'src/jobseekers/jobseekers.service';
import { JobSeeker } from 'src/jobseekers/entities/jobseeker.entity';
import { Resume } from 'src/jobseekers/entities/resume.entity';
import { SavedJob } from 'src/jobseekers/entities/saved-job.entity';
import { InterviewPreference } from 'src/jobseekers/entities/interview-preference.entity';
import { EducationHistory } from 'src/jobseekers/entities/education.entity';
import { WorkExperience } from 'src/jobseekers/entities/experience.entity';
import { SkillTag } from 'src/jobseekers/entities/skill.entity';
import { InterviewInvitation } from 'src/jobseekers/entities/interview-invitation.entity';
import { JobAlert } from 'src/jobseekers/entities/job-alert.entity';
import { Notification } from 'src/companies/entities/notification.entity';
import { Portfolio } from 'src/jobseekers/entities/portfolio.entity';
import { SocialLink } from 'src/jobseekers/entities/social-link.entity';
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([
      Role,
      Company,
      Member,
      Technology,
      CompanyTechStack,
      OfficeLocation,
      OfficeImage,

      CompanyDocument,
      Job,
      JobApplication,
      Interview,
      Notification,
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
      Portfolio,
      SocialLink,
      JobAlert,
    ]), // This makes RoleRepository available
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1min' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    CompaniesService,
    AuthService,
    JwtStrategy,
    Reflector,
    JwtService,
    BcryptProvider,
    FilesService,
    RolesService,
    JobSeekersService,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
