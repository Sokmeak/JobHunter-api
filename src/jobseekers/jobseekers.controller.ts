import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
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

@Controller('job-seekers')
export class JobSeekersController {
  private readonly logger = new Logger(JobSeekersController.name);

  constructor(private readonly jobSeekersService: JobSeekersService) {}

  @Post('profile')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async createProfile(
    @Request() req,
    @Body() createJobSeekerDto: CreateJobSeekerDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/profile called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.createJobSeeker(
        req.user.id,
        createJobSeekerDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/profile for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Patch('profile')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async updateProfile(
    @Request() req,
    @Body() createJobSeekerDto: Partial<CreateJobSeekerDto>,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `PATCH /job-seekers/profile called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.updateJobSeeker(
        req.user.id,
        createJobSeekerDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in PATCH /job-seekers/profile for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Patch('password')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async changePassword(
    @Request() req,
    @Body() passwordData: { currentPassword: string; newPassword: string },
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `PATCH /job-seekers/password called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.changePassword(
        req.user.id,
        passwordData.currentPassword,
        passwordData.newPassword,
      );
    } catch (err) {
      this.logger.error(
        `Error in PATCH /job-seekers/password for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('profile-image')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/profile-image called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.uploadProfileImage(req.user.id, file);
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/profile-image for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Get('profile')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getProfile(@Request() req: any) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(`GET /job-seekers/profile called for user: ${req.user.id}`);
    try {
      return await this.jobSeekersService.getJobSeeker(req.user.id);
    } catch (err) {
      this.logger.error(
        `Error in GET /job-seekers/profile for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('resumes')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadResume(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() createResumeDto: CreateResumeDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/resumes called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.uploadResume(
        req.user.id,
        file,
        createResumeDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/resumes for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Delete('resumes/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async deleteResume(@Request() req, @Param('id') resumeId: number) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `DELETE /job-seekers/resumes/${resumeId} called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.deleteResume(req.user.id, resumeId);
    } catch (err) {
      this.logger.error(
        `Error in DELETE /job-seekers/resumes/${resumeId} for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('applications')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async applyForJob(
    @Request() req,
    @Body() createJobApplicationDto: CreateJobApplicationDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/applications called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.applyForJob(
        req.user.id,
        createJobApplicationDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/applications for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Patch('applications/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async updateJobApplication(
    @Request() req,
    @Param('id') applicationId: number,
    @Body() createJobApplicationDto: CreateJobApplicationDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `PATCH /job-seekers/applications/${applicationId} called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.updateJobApplication(
        applicationId,
        createJobApplicationDto,
        req.user.id,
      );
    } catch (err) {
      this.logger.error(
        `Error in PATCH /job-seekers/applications/${applicationId} for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Get('applications/:id/status')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getApplicationStatus(
    @Request() req,
    @Param('id') applicationId: number,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `GET /job-seekers/applications/${applicationId}/status called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.getApplicationStatus(
        req.user.id,
        applicationId,
      );
    } catch (err) {
      this.logger.error(
        `Error in GET /job-seekers/applications/${applicationId}/status for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('saved-jobs')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async saveJob(@Request() req, @Body() createSavedJobDto: CreateSavedJobDto) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/saved-jobs called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.saveJob(
        req.user.id,
        createSavedJobDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/saved-jobs for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('interview-preferences')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async setInterviewPreference(
    @Request() req,
    @Body() createInterviewPreferenceDto: CreateInterviewPreferenceDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/interview-preferences called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.setInterviewPreference(
        req.user.id,
        createInterviewPreferenceDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/interview-preferences for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Get('interview-invitations')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getInterviewInvitations(@Request() req) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `GET /job-seekers/interview-invitations called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.getInterviewInvitations(req.user.id);
    } catch (err) {
      this.logger.error(
        `Error in GET /job-seekers/interview-invitations for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Patch('interview-invitations/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async updateInterviewInvitation(
    @Request() req,
    @Param('id') invitationId: number,
    @Body() updateInterviewInvitationDto: UpdateInterviewInvitationDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `PATCH /job-seekers/interview-invitations/${invitationId} called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.updateInterviewInvitation(
        req.user.id,
        invitationId,
        updateInterviewInvitationDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in PATCH /job-seekers/interview-invitations/${invitationId} for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('education-history')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async addEducationHistory(
    @Request() req,
    @Body() createEducationHistoryDto: CreateEducationHistoryDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/education-history called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.addEducationHistory(
        req.user.id,
        createEducationHistoryDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/education-history for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Patch('education-history/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async updateEducationHistory(
    @Request() req,
    @Param('id') educationId: number,
    @Body() createEducationHistoryDto: CreateEducationHistoryDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `PATCH /job-seekers/education-history/${educationId} called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.updateEducationHistory(
        req.user.id,
        educationId,
        createEducationHistoryDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in PATCH /job-seekers/education-history/${educationId} for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Delete('education-history/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async deleteEducationHistory(
    @Request() req,
    @Param('id') educationId: number,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `DELETE /job-seekers/education-history/${educationId} called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.deleteEducationHistory(
        req.user.id,
        educationId,
      );
    } catch (err) {
      this.logger.error(
        `Error in DELETE /job-seekers/education-history/${educationId} for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('work-experience')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async addWorkExperience(
    @Request() req,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/work-experience called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.addWorkExperience(
        req.user.id,
        createWorkExperienceDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/work-experience for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Patch('work-experience/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async updateWorkExperience(
    @Request() req,
    @Param('id') experienceId: number,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `PATCH /job-seekers/work-experience/${experienceId} called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.updateWorkExperience(
        req.user.id,
        experienceId,
        createWorkExperienceDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in PATCH /job-seekers/work-experience/${experienceId} for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Delete('work-experience/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async deleteWorkExperience(
    @Request() req,
    @Param('id') experienceId: number,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `DELETE /job-seekers/work-experience/${experienceId} called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.deleteWorkExperience(
        req.user.id,
        experienceId,
      );
    } catch (err) {
      this.logger.error(
        `Error in DELETE /job-seekers/work-experience/${experienceId} for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('skill-tags')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async addSkillTag(
    @Request() req,
    @Body() createSkillTagDto: CreateSkillTagDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/skill-tags called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.addSkillTag(
        req.user.id,
        createSkillTagDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/skill-tags for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Delete('skill-tags/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async deleteSkillTag(@Request() req, @Param('id') skillId: number) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `DELETE /job-seekers/skill-tags/${skillId} called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.deleteSkillTag(req.user.id, skillId);
    } catch (err) {
      this.logger.error(
        `Error in DELETE /job-seekers/skill-tags/${skillId} for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Get('notifications')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getNotifications(@Request() req) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `GET /job-seekers/notifications called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.getNotifications(req.user.id);
    } catch (err) {
      this.logger.error(
        `Error in GET /job-seekers/notifications for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Patch('notifications/:id/read')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async markNotificationAsRead(
    @Request() req,
    @Param('id') notificationId: number,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `PATCH /job-seekers/notifications/${notificationId}/read called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.markNotificationAsRead(
        req.user.id,
        notificationId,
      );
    } catch (err) {
      this.logger.error(
        `Error in PATCH /job-seekers/notifications/${notificationId}/read for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Post('job-alerts')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async createJobAlert(
    @Request() req,
    @Body() createJobAlertDto: CreateJobAlertDto,
  ) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `POST /job-seekers/job-alerts called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.createJobAlert(
        req.user.id,
        createJobAlertDto,
      );
    } catch (err) {
      this.logger.error(
        `Error in POST /job-seekers/job-alerts for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }

  @Get('job-alerts')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getJobAlerts(@Request() req) {
    if (!req.user || !req.user.id) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }
    this.logger.log(
      `GET /job-seekers/job-alerts called for user: ${req.user.id}`,
    );
    try {
      return await this.jobSeekersService.getJobAlerts(req.user.id);
    } catch (err) {
      this.logger.error(
        `Error in GET /job-seekers/job-alerts for user: ${req.user.id}`,
        err.stack,
      );
      throw err;
    }
  }
}
