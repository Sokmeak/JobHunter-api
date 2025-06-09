import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';

import * as multer from 'multer';
import { JobSeekersService } from './jobseekers.service';
import { CreateJobSeekerDto } from './dto/create-jobseeker.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateResumeDto } from './resume/dto/create-resume.dto';
import { CreateJobApplicationDto } from './application/dto/create-job-application.dto';
import { CreateSavedJobDto } from './jobs/dto/create-saved-job.dto';
import { CreateInterviewPreferenceDto } from './interview-preference/dto/create-interview-preference.dto';
import { UpdateInterviewInvitationDto } from './interview-invitation/dto/update-interview-invitation.dto';
import { CreateEducationHistoryDto } from './education/dto/create-education.dto';
import { CreateWorkExperienceDto } from './experience/dto/create-experience.dto';
import { CreateSkillTagDto } from './skill/dto/create-skill.dto';
import { CreateJobAlertDto } from './job-alert/dto/create-job-alert.dto';

@Controller('job-seekers')
export class JobSeekersController {
  constructor(private readonly jobSeekersService: JobSeekersService) {}

  @Post('profile')
  createProfile(
    @Request() req,
    @Body() createJobSeekerDto: CreateJobSeekerDto,
  ) {
    return this.jobSeekersService.createJobSeeker(
      req.user.id,
      createJobSeekerDto,
    );
  }

  @Patch('profile')
  updateProfile(
    @Request() req,
    @Body() updateJobSeekerDto: CreateJobSeekerDto,
  ) {
    return this.jobSeekersService.updateJobSeeker(
      req.user.id,
      updateJobSeekerDto,
    );
  }

  @Post('profile-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.jobSeekersService.uploadProfileImage(req.user.id, file);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.jobSeekersService.getJobSeeker(req.user.id);
  }

  @Post('resumes')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadResume(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() createResumeDto: CreateResumeDto,
  ) {
    return this.jobSeekersService.uploadResume(
      req.user.id,
      file,
      createResumeDto,
    );
  }

  @Post('applications')
  applyForJob(
    @Request() req,
    @Body() createJobApplicationDto: CreateJobApplicationDto,
  ) {
    return this.jobSeekersService.applyForJob(
      req.user.id,
      createJobApplicationDto,
    );
  }

  @Get('applications/:id/status')
  getApplicationStatus(@Request() req, @Param('id') applicationId: string) {
    return this.jobSeekersService.getApplicationStatus(
      req.user.id,
      applicationId,
    );
  }

  @Post('saved-jobs')
  saveJob(@Request() req, @Body() createSavedJobDto: CreateSavedJobDto) {
    return this.jobSeekersService.saveJob(req.user.id, createSavedJobDto);
  }

  @Post('interview-preferences')
  setInterviewPreference(
    @Request() req,
    @Body() createInterviewPreferenceDto: CreateInterviewPreferenceDto,
  ) {
    return this.jobSeekersService.setInterviewPreference(
      req.user.id,
      createInterviewPreferenceDto,
    );
  }

  @Get('interview-invitations')
  getInterviewInvitations(@Request() req) {
    return this.jobSeekersService.getInterviewInvitations(req.user.id);
  }

  @Patch('interview-invitations/:id')
  updateInterviewInvitation(
    @Request() req,
    @Param('id') invitationId: string,
    @Body() updateInterviewInvitationDto: UpdateInterviewInvitationDto,
  ) {
    return this.jobSeekersService.updateInterviewInvitation(
      req.user.id,
      invitationId,
      updateInterviewInvitationDto,
    );
  }

  @Post('education-history')
  addEducationHistory(
    @Request() req,
    @Body() createEducationHistoryDto: CreateEducationHistoryDto,
  ) {
    return this.jobSeekersService.addEducationHistory(
      req.user.id,
      createEducationHistoryDto,
    );
  }

  @Post('work-experience')
  addWorkExperience(
    @Request() req,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ) {
    return this.jobSeekersService.addWorkExperience(
      req.user.id,
      createWorkExperienceDto,
    );
  }

  @Post('skill-tags')
  addSkillTag(@Request() req, @Body() createSkillTagDto: CreateSkillTagDto) {
    return this.jobSeekersService.addSkillTag(req.user.id, createSkillTagDto);
  }

  @Get('notifications')
  getNotifications(@Request() req) {
    return this.jobSeekersService.getNotifications(req.user.id);
  }

  @Patch('notifications/:id/read')
  markNotificationAsRead(@Request() req, @Param('id') notificationId: string) {
    return this.jobSeekersService.markNotificationAsRead(
      req.user.id,
      notificationId,
    );
  }

  // @Post('search-jobs')
  // searchJobs(@Body() searchJobsDto: SearchJobsDto) {
  //   return this.jobSeekersService.searchJobs(searchJobsDto);
  // }

  // @Get('job-recommendations')
  // getJobRecommendations(@Request() req) {
  //   return this.jobSeekersService.getJobRecommendations(req.user.id);
  // }

  // @Get('salary-insights')
  // getSalaryInsights(@Query('industry') industry: string) {
  //   return this.jobSeekersService.getSalaryInsights(industry);
  // }

  // @Get('company-reviews/:companyId')
  // getCompanyReviews(@Param('companyId') companyId: string) {
  //   return this.jobSeekersService.getCompanyReviews(companyId);
  // }

  @Post('job-alerts')
  createJobAlert(@Request() req, @Body() createJobAlertDto: CreateJobAlertDto) {
    return this.jobSeekersService.createJobAlert(
      req.user.id,
      createJobAlertDto,
    );
  }

  @Get('job-alerts')
  getJobAlerts(@Request() req) {
    return this.jobSeekersService.getJobAlerts(req.user.id);
  }
}
