
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  Req,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
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
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdateSocialLinkDto } from './dto/create-social-link.dto';

@Controller('job-seekers')
export class JobSeekersController {
  constructor(private readonly jobSeekersService: JobSeekersService) {}

  @Post('profile')
  @UseGuards(AuthenticationGuard, RolesGuard)
  createProfile(@Req() req, @Body() createJobSeekerDto: CreateJobSeekerDto) {
    return this.jobSeekersService.createJobSeeker(
      (req.user as any).id,
      createJobSeekerDto,
    );
  }

  @Patch('profile')
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateProfile(@Req() req, @Body() createJobSeekerDto: CreateJobSeekerDto) {
    return this.jobSeekersService.updateJobSeeker(
      (req.user as any).id,
      createJobSeekerDto,
    );
  }

  @Post('profile-image')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadProfileImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.jobSeekersService.uploadProfileImage(
      (req.user as any).id,
      file,
    );
  }

  @Get('profile')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getProfile(@Req() req) {
    log((req.user as any).id);
    return this.jobSeekersService.getJobSeeker((req.user as any).id);
  }

  @Get('resumes')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getResume(@Req() req) {
    return this.jobSeekersService.getResume((req.user as any).id);
  }

  @Post('resumes')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadResume(
    @Req() req,
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
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteResume(@Req() req, @Param('id') resumeId: number) {
    return this.jobSeekersService.deleteResume((req.user as any).id, resumeId);
  }

  @Post('applications')
  @UseGuards(AuthenticationGuard, RolesGuard)
  applyForJob(
    @Req() req,
    @Body() createJobApplicationDto: CreateJobApplicationDto,
  ) {
    return this.jobSeekersService.applyForJob(
      (req.user as any).id,
      createJobApplicationDto,
    );
  }

  @Get('applications/:id/status')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getApplicationStatus(@Req() req, @Param('id') applicationId: number) {
    return this.jobSeekersService.getApplicationStatus(
      (req.user as any).id,
      applicationId,
    );
  }

  @Post('saved-jobs')
  @UseGuards(AuthenticationGuard, RolesGuard)
  saveJob(@Req() req, @Body() createSavedJobDto: CreateSavedJobDto) {
    return this.jobSeekersService.saveJob(
      (req.user as any).id,
      createSavedJobDto,
    );
  }

  @Post('interview-preferences')
  @UseGuards(AuthenticationGuard, RolesGuard)
  setInterviewPreference(
    @Req() req,
    @Body() createInterviewPreferenceDto: CreateInterviewPreferenceDto,
  ) {
    return this.jobSeekersService.setInterviewPreference(
      (req.user as any).id,
      createInterviewPreferenceDto,
    );
  }

  @Get('interview-invitations')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getInterviewInvitations(@Req() req) {
    return this.jobSeekersService.getInterviewInvitations((req.user as any).id);
  }

  @Patch('interview-invitations/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateInterviewInvitation(
    @Req() req,
    @Param('id') invitationId: number,
    @Body() updateInterviewInvitationDto: UpdateInterviewInvitationDto,
  ) {
    return this.jobSeekersService.updateInterviewInvitation(
      (req.user as any).id,
      invitationId,
      updateInterviewInvitationDto,
    );
  }

  @Get('education-history')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getEducationHistory(@Req() req: Express.Request) {
    return this.jobSeekersService.getEducationHistory((req.user as any).id);
  }
  
  @Post('education-history')
  @UseGuards(AuthenticationGuard, RolesGuard)
  addEducationHistory(
    @Req() req,
    @Body() createEducationHistoryDto: CreateEducationHistoryDto,
  ) {
    return this.jobSeekersService.addEducationHistory(
      (req.user as any).id,
      createEducationHistoryDto,
    );
  }

  @Patch('education-history/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateEducationHistory(
    @Req() req,
    @Param('id') educationId: number,
    @Body() createEducationHistoryDto: CreateEducationHistoryDto,
  ) {
    return this.jobSeekersService.updateEducationHistory(
      (req.user as any).id,
      educationId,
      createEducationHistoryDto,
    );
  }

  @Delete('education-history/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteEducationHistory(@Req() req, @Param('id') educationId: number) {
    return this.jobSeekersService.deleteEducationHistory(
      (req.user as any).id,
      educationId,
    );
  }

  @Post('work-experience')
  @UseGuards(AuthenticationGuard, RolesGuard)
  addWorkExperience(
    @Req() req,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ) {
    return this.jobSeekersService.addWorkExperience(
      (req.user as any).id,
      createWorkExperienceDto,
    );
  }

  @Patch('work-experience/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateWorkExperience(
    @Req() req,
    @Param('id') experienceId: number,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ) {
    return this.jobSeekersService.updateWorkExperience(
      (req.user as any).id,
      experienceId,
      createWorkExperienceDto,
    );
  }

  @Delete('work-experience/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteWorkExperience(@Req() req, @Param('id') experienceId: number) {
    return this.jobSeekersService.deleteWorkExperience(
      (req.user as any).id,
      experienceId,
    );
  }

  @Get('skill-tags')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getSkillTags(@Req() req) {
    const skills = await this.jobSeekersService.getSkillTags(
      (req.user as any).id,
    );
    return { skills }; // <-- wrap in object
  }

  @Post('skill-tags')
  @UseGuards(AuthenticationGuard, RolesGuard)
  addSkillTag(
    @Req() req: Express.Request,
    @Body() createSkillTagDto: CreateSkillTagDto,
  ) {
    if (!req.user || !(req.user as any).id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.jobSeekersService.addSkillTag(
      (req.user as any).id,
      createSkillTagDto,
    );
  }

  @Delete('skill-tags/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async deleteSkillTag(@Req() req, @Param('id') id: number) {
    await this.jobSeekersService.deleteSkillTag(
      (req.user as any).id,
      Number(id),
    );
    return { message: 'Skill tag deleted successfully' };
  }

  @Get('notifications')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getNotifications(@Req() req) {
    return this.jobSeekersService.getNotifications((req.user as any).id);
  }

  @Patch('notifications/:id/read')
  @UseGuards(AuthenticationGuard, RolesGuard)
  markNotificationAsRead(@Req() req, @Param('id') notificationId: number) {
    return this.jobSeekersService.markNotificationAsRead(
      (req.user as any).id,
      notificationId,
    );
  }

  @Post('job-alerts')
  @UseGuards(AuthenticationGuard, RolesGuard)
  createJobAlert(@Req() req, @Body() createJobAlertDto: CreateJobAlertDto) {
    return this.jobSeekersService.createJobAlert(
      (req.user as any).id,
      createJobAlertDto,
    );
  }

  @Get('job-alerts')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getJobAlerts(@Req() req) {
    return this.jobSeekersService.getJobAlerts((req.user as any).id);
  }

  @Post('portfolios')
  @UseGuards(AuthenticationGuard, RolesGuard)
  addPortfolio(@Req() req, @Body() createPortfolioDto: CreatePortfolioDto) {
    return this.jobSeekersService.addPortfolio(
      (req.user as any).id,
      createPortfolioDto,
    );
  }

  @Get('portfolios')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getPortfolios(@Req() req) {
    return this.jobSeekersService.getPortfolios((req.user as any).id);
  }

  @Patch('portfolios/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  updatePortfolio(
    @Req() req,
    @Param('id') portfolioId: number,
    @Body() createPortfolioDto: CreatePortfolioDto,
  ) {
    return this.jobSeekersService.updatePortfolio(
      (req.user as any).id,
      portfolioId,
      createPortfolioDto,
    );
  }

  @Delete('portfolios/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deletePortfolio(@Req() req, @Param('id') portfolioId: number) {
    return this.jobSeekersService.deletePortfolio(
      (req.user as any).id,
      portfolioId,
    );
  }

  @Post('social-links')
  @UseGuards(AuthenticationGuard, RolesGuard)
  addSocialLink(@Req() req, @Body() body: { url: string; platform?: string }) {
    return this.jobSeekersService.addSocialLink((req.user as any).id, body);
  }

  @Get('social-links')
  @UseGuards(AuthenticationGuard, RolesGuard)
  getSocialLinks(@Req() req) {
    return this.jobSeekersService.getSocialLinks((req.user as any).id);
  }

  @Patch('social-links/:id') // Updated method name to match intent
  @UseGuards(AuthenticationGuard, RolesGuard)
  updateSocialLink(
    @Req() req,
    @Param('id') socialLinkId: number,
    @Body() updateSocialLinkDto: UpdateSocialLinkDto,
  ) {
    return this.jobSeekersService.updateSocialLink(
      (req.user as any).id,
      socialLinkId,
      updateSocialLinkDto,
    );
  }

  @Delete('social-links/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  deleteSocialLink(@Req() req, @Param('id') socialLinkId: number) {
    return this.jobSeekersService.deleteSocialLink(
      (req.user as any).id,
      socialLinkId,
    );
  }
}