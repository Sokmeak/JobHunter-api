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
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer'; // Ensure this import works
import { Express } from 'express';
import { JobSeekersService } from './jobseekers.service';
import { CreateJobSeekerDto } from './dto/create-jobseeker.dto';
import { CreateResumeDto } from './dto/create-resume.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { CreateSavedJobDto } from './dto/create-saved-job.dto';
import { CreateInterviewPreferenceDto } from './dto/create-interview-preference.dto';
import { UpdateInterviewInvitationDto } from './dto/update-interview-invitation.dto';
import { CreateEducationHistoryDto } from './dto/create-education.dto';
import { CreateWorkExperienceDto } from './dto/create-experience.dto';
import { CreateSkillTagDto } from './dto/create-skill.dto';
import { CreateJobAlertDto } from './dto/create-job-alert.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { log } from 'console';

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
    @Body() createJobSeekerDto: CreateJobSeekerDto,
  ) {
    return this.jobSeekersService.updateJobSeeker(
      req.user.id,
      createJobSeekerDto,
    );
  }

  @Post('profile-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // Fixed import should resolve this
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
  @UseGuards(AuthenticationGuard, RolesGuard)
  getProfile(@Request() req) {
    log(req.user.id);
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

  @Delete('resumes/:id')
  deleteResume(@Request() req, @Param('id') resumeId: number) {
    return this.jobSeekersService.deleteResume(req.user.id, resumeId);
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

  @Patch('education-history/:id')
  updateEducationHistory(
    @Request() req,
    @Param('id') educationId: number,
    @Body() createEducationHistoryDto: CreateEducationHistoryDto,
  ) {
    return this.jobSeekersService.updateEducationHistory(
      req.user.id,
      educationId,
      createEducationHistoryDto,
    );
  }

  @Delete('education-history/:id')
  deleteEducationHistory(@Request() req, @Param('id') educationId: number) {
    return this.jobSeekersService.deleteEducationHistory(
      req.user.id,
      educationId,
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

  @Patch('work-experience/:id')
  updateWorkExperience(
    @Request() req,
    @Param('id') experienceId: string,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ) {
    return this.jobSeekersService.updateWorkExperience(
      req.user.id,
      experienceId,
      createWorkExperienceDto,
    );
  }

  @Delete('work-experience/:id')
  deleteWorkExperience(@Request() req, @Param('id') experienceId: string) {
    return this.jobSeekersService.deleteWorkExperience(
      req.user.id,
      experienceId,
    );
  }

  @Post('skill-tags')
  addSkillTag(@Request() req, @Body() createSkillTagDto: CreateSkillTagDto) {
    return this.jobSeekersService.addSkillTag(req.user.id, createSkillTagDto);
  }

  @Delete('skill-tags/:id')
  deleteSkillTag(@Request() req, @Param('id') skillId: number) {
    return this.jobSeekersService.deleteSkillTag(req.user.id, skillId);
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
