import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { JobSeeker } from './entities/jobseeker.entity';
import { EducationHistory } from './entities/education.entity';
import { SkillTag } from './entities/skill.entity';
import { WorkExperience } from './entities/experience.entity';
import { InterviewInvitation } from './entities/interview-invitation.entity';
import { JobAlert } from './entities/job-alert.entity';
import { Job } from 'src/companies/entities/job.entity';

import { Company } from 'src/companies/entities/company.entity';
import { CreateJobSeekerDto } from './dto/create-jobseeker.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { CreateSavedJobDto } from './dto/create-saved-job.dto';
import { UpdateInterviewInvitationDto } from './dto/update-interview-invitation.dto';
import { CreateEducationHistoryDto } from './dto/create-education.dto';
import { CreateWorkExperienceDto } from './dto/create-experience.dto';
import { CreateSkillTagDto } from './dto/create-skill.dto';
import { CreateJobAlertDto } from './dto/create-job-alert.dto';
import { Resume } from './entities/resume.entity';
import { InterviewPreference } from './entities/interview-preference.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { CreateInterviewPreferenceDto } from './dto/create-interview-preference.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification_Applicant } from './entities/notification.entity';
import { SavedJob } from './entities/saved-job.entity';
import { JobApplication } from './entities/application.entity';
import { Express } from 'express';
import { log } from 'console';
import { Portfolio } from './entities/portfolio.entity';
import { SocialLink } from './entities/social-link.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdateSocialLinkDto } from './dto/create-social-link.dto';

@Injectable()
export class JobSeekersService {
  getPortfolios(id: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(JobSeeker)
    private jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(SavedJob)
    private savedJobRepository: Repository<SavedJob>,
    @InjectRepository(InterviewPreference)
    private interviewPreferenceRepository: Repository<InterviewPreference>,
    @InjectRepository(EducationHistory)
    private educationHistoryRepository: Repository<EducationHistory>,
    @InjectRepository(WorkExperience)
    private workExperienceRepository: Repository<WorkExperience>,
    @InjectRepository(SkillTag)
    private skillTagRepository: Repository<SkillTag>,
    @InjectRepository(Notification_Applicant)
    private notificationRepository: Repository<Notification_Applicant>,
    @InjectRepository(InterviewInvitation)
    private interviewInvitationRepository: Repository<InterviewInvitation>,
    @InjectRepository(JobAlert)
    private jobAlertRepository: Repository<JobAlert>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(SocialLink)
    private socialLinkRepository: Repository<SocialLink>,
    private filesService: FilesService,
  ) {}

  async createJobSeeker(
    userId: number,
    dto: CreateJobSeekerDto,
  ): Promise<JobSeeker> {
    if (dto.user_id !== userId) {
      throw new Error('userId mismatch');
    }

    const jobSeeker = this.jobSeekerRepository.create({
      ...dto,
      educationHistory: [],
      workExperience: [],
      skillTags: [],
      resumes: [],
      applications: [],
      savedJobs: [],
      interviewInvitations: [],
      jobAlerts: [],
      portfolios: [],
      socialLinks: [],
    });

    if (dto.jobIds && dto.jobIds.length > 0) {
      const jobs = await this.jobRepository.findByIds(dto.jobIds);
      jobSeeker.jobs = jobs;
    }

    return await this.jobSeekerRepository.save(jobSeeker);
  }
  async updateJobSeeker(
    userId: number,
    updateJobSeekerDto: CreateJobSeekerDto,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
      relations: [
        'educationHistory',
        'workExperience',
        'skillTags',
        'resumes',
        'applications',
        'savedJobs',
        'interviewInvitations',
        'jobAlerts',
        'portfolios',
        'socialLinks',
      ],
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');
    Object.assign(jobSeeker, updateJobSeekerDto);
    return this.jobSeekerRepository.save(jobSeeker);
  }

  async uploadProfileImage(
    userId: number,
    file: Express.Multer.File,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    const uploadResult = await this.filesService.uploadFile(file);
    jobSeeker.profile_image = uploadResult.originalPath;
    const savedJobSeeker = await this.jobSeekerRepository.save(jobSeeker);
    savedJobSeeker['profile_image_thumbnail'] =
      await this.filesService.getFileUrl(uploadResult.fileName, 'thumbnail');
    return savedJobSeeker;
  }

  async getJobSeeker(userId: number): Promise<JobSeeker> {
    log('UserId' + userId);
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
      relations: [
        'resumes',
        'applications',
        'savedJobs',
        'interviewPreference',
        'educationHistory',
        'workExperience',
        'skillTags',
        'interviewInvitations',
        'jobAlerts',
        'portfolios',
        'socialLinks',
      ],
    });

    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    // Ensure all array fields are initialized as empty arrays if null
    jobSeeker.educationHistory = jobSeeker.educationHistory || [];
    jobSeeker.workExperience = jobSeeker.workExperience || [];
    jobSeeker.skillTags = jobSeeker.skillTags || [];
    jobSeeker.resumes = jobSeeker.resumes || [];
    jobSeeker.applications = jobSeeker.applications || [];
    jobSeeker.savedJobs = jobSeeker.savedJobs || [];
    jobSeeker.interviewInvitations = jobSeeker.interviewInvitations || [];
    jobSeeker.jobAlerts = jobSeeker.jobAlerts || [];
    jobSeeker.portfolios = jobSeeker.portfolios || [];
    jobSeeker.socialLinks = jobSeeker.socialLinks || [];

    return jobSeeker;
  }

  async getResume(userId: number): Promise<Resume> {
    // Find the resume by ID and ensure it belongs to the authenticated user
    const resumes = await this.resumeRepository.findOne({
      where: { job_seeker_id: userId },
    });

    log('Resumes: ', resumes);

    if (!resumes) {
      throw new NotFoundException('Resume not found or access denied');
    }

    return resumes;
  }
  async uploadResume(
    userId: number,
    file: Express.Multer.File,
    createResumeDto: CreateResumeDto,
  ): Promise<Resume> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    const uploadResult = await this.filesService.uploadFile(file);
    const resume = this.resumeRepository.create({
      job_seeker_id: jobSeeker.user_id,
      resume_url: uploadResult.originalPath,
      is_primary: createResumeDto.is_primary || false,
    });

    if (resume.is_primary) {
      await this.resumeRepository.update(
        { job_seeker_id: userId, is_primary: true },
        { is_primary: false },
      );
    }

    const savedResume = await this.resumeRepository.save(resume);
    savedResume['thumbnail_url'] = await this.filesService.getFileUrl(
      uploadResult.fileName,
      'thumbnail',
    );
    return savedResume;
  }

  async deleteResume(userId: number, resumeId: number): Promise<void> {
    const resume = await this.resumeRepository.findOne({
      where: { id: resumeId, job_seeker_id: userId },
    });
    if (!resume) throw new NotFoundException('Resume not found');
    await this.filesService.deleteFile(
      resume.resume_url.split('/').pop() ?? '',
    );
    await this.resumeRepository.delete(resumeId);
  }

  async applyForJob(
    userId: number,
    createJobApplicationDto: CreateJobApplicationDto,
  ): Promise<JobApplication> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    const job = await this.jobRepository.findOne({
      where: { id: +createJobApplicationDto.job_id },
    });
    if (!job) throw new NotFoundException('Job not found');

    const existingApplication = await this.jobApplicationRepository.findOne({
      where: { job_seeker_id: userId, job_id: createJobApplicationDto.job_id },
    });
    if (existingApplication)
      throw new BadRequestException('Already applied for this job');

    const application = this.jobApplicationRepository.create({
      job_seeker_id: userId,
      ...createJobApplicationDto,
      status: 'pending',
    });

    const savedApplication =
      await this.jobApplicationRepository.save(application);

    let notificationData: CreateNotificationDto;
    notificationData = {
      user_id: userId,
      title: 'Job Application Submitted',
      message: `Your application for ${job.title} has been submitted successfully.`,
    };

    const notification = this.notificationRepository.create(notificationData);
    await this.notificationRepository.save(notification);

    return savedApplication;
  }

  async getApplicationStatus(
    userId: number,
    applicationId: number,
  ): Promise<JobApplication> {
    const application = await this.jobApplicationRepository.findOne({
      where: { id: applicationId, job_seeker_id: userId },
      relations: ['job'],
    });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async saveJob(
    userId: number,
    createSavedJobDto: CreateSavedJobDto,
  ): Promise<SavedJob> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    const job = await this.jobRepository.findOne({
      where: { id: +createSavedJobDto.job_id },
    });
    if (!job) throw new NotFoundException('Job not found');

    const existingSavedJob = await this.savedJobRepository.findOne({
      where: { job_seeker_id: userId, job_id: createSavedJobDto.job_id },
    });

    if (existingSavedJob) throw new BadRequestException('Job already saved');

    const savedJob = this.savedJobRepository.create({
      job_seeker_id: userId,
      job_id: createSavedJobDto.job_id,
    });
    return this.savedJobRepository.save(savedJob);
  }

  async setInterviewPreference(
    userId: number,
    createInterviewPreferenceDto: CreateInterviewPreferenceDto,
  ): Promise<InterviewPreference> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    let preference = await this.interviewPreferenceRepository.findOne({
      where: { job_seeker_id: userId },
    });
    if (preference) {
      Object.assign(preference, createInterviewPreferenceDto);
    } else {
      preference = this.interviewPreferenceRepository.create({
        job_seeker_id: userId,
        ...createInterviewPreferenceDto,
      });
    }
    return this.interviewPreferenceRepository.save(preference);
  }

  async getInterviewInvitations(
    userId: number,
  ): Promise<InterviewInvitation[]> {
    return this.interviewInvitationRepository.find({
      where: { job_seeker_id: userId },
      relations: ['job', 'company'],
      order: { created_at: 'DESC' },
    });
  }

  async updateInterviewInvitation(
    userId: number,
    invitationId: number,
    updateInterviewInvitationDto: UpdateInterviewInvitationDto,
  ): Promise<InterviewInvitation> {
    const invitation = await this.interviewInvitationRepository.findOne({
      where: { id: invitationId, job_seeker_id: userId },
      relations: ['job'],
    });
    if (!invitation)
      throw new NotFoundException('Interview invitation not found');

    if (invitation.invitation_status !== 'pending') {
      throw new BadRequestException('Invitation already processed');
    }

    invitation.invitation_status =
      updateInterviewInvitationDto.invitation_status;
    const updatedInvitation =
      await this.interviewInvitationRepository.save(invitation);

    let notificationData: CreateNotificationDto;
    notificationData = {
      user_id: userId,
      title: `Interview ${updateInterviewInvitationDto.invitation_status}`,
      message: `You have ${updateInterviewInvitationDto.invitation_status} an interview invitation for ${invitation.job.title}.`,
    };
    const notification = this.notificationRepository.create(notificationData);
    await this.notificationRepository.save(notification);

    return updatedInvitation;
  }

  async getEducationHistory(userId: number) {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
      relations: ['educationHistory'],
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');
    return jobSeeker.educationHistory || [];
  }
  async addEducationHistory(
    userId: number,
    createEducationHistoryDto: CreateEducationHistoryDto,
  ): Promise<EducationHistory> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    const education = this.educationHistoryRepository.create({
      job_seeker_id: userId,
      ...createEducationHistoryDto,
    });
    return this.educationHistoryRepository.save(education);
  }

  async updateEducationHistory(
    userId: number,
    educationId: number,
    createEducationHistoryDto: CreateEducationHistoryDto,
  ): Promise<EducationHistory> {
    const education = await this.educationHistoryRepository.findOne({
      where: { id: educationId, job_seeker_id: userId },
    });
    if (!education) throw new NotFoundException('Education history not found');
    Object.assign(education, createEducationHistoryDto);
    return this.educationHistoryRepository.save(education);
  }

  async deleteEducationHistory(
    userId: number,
    educationId: number,
  ): Promise<void> {
    const education = await this.educationHistoryRepository.findOne({
      where: { id: educationId, job_seeker_id: userId },
    });
    if (!education) throw new NotFoundException('Education history not found');
    await this.educationHistoryRepository.remove(education);
  }

  async addWorkExperience(
    userId: number,
    createWorkExperienceDto: CreateWorkExperienceDto,
  ): Promise<WorkExperience> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    const experience = this.workExperienceRepository.create({
      job_seeker_id: userId,
      ...createWorkExperienceDto,
    });
    return this.workExperienceRepository.save(experience);
  }

  async updateWorkExperience(
    userId: number,
    experienceId: number,
    createWorkExperienceDto: CreateWorkExperienceDto,
  ): Promise<WorkExperience> {
    const experience = await this.workExperienceRepository.findOne({
      where: { id: experienceId, job_seeker_id: userId },
    });
    if (!experience) throw new NotFoundException('Work experience not found');
    Object.assign(experience, createWorkExperienceDto);
    return this.workExperienceRepository.save(experience);
  }

  async deleteWorkExperience(
    userId: number,
    experienceId: number,
  ): Promise<void> {
    const experience = await this.workExperienceRepository.findOne({
      where: { id: experienceId, job_seeker_id: userId },
    });
    if (!experience) throw new NotFoundException('Work experience not found');
    await this.workExperienceRepository.remove(experience);
  }

  async getSkillTags(userId: number): Promise<SkillTag[]> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
      relations: ['skillTags'],
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');
    return jobSeeker.skillTags || [];
  }

  async addSkillTag(userId: number, dto: CreateSkillTagDto): Promise<SkillTag> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');
    const skillTag = this.skillTagRepository.create({
      skill_name: dto.skill_name,
      jobSeeker,
      job_seeker_id: jobSeeker.id,
    });
    return this.skillTagRepository.save(skillTag);
  }

  async deleteSkillTag(userId: number, skillTagId: number): Promise<void> {
    const skillTag = await this.skillTagRepository.findOne({
      where: { id: skillTagId, job_seeker_id: userId },
    });
    if (!skillTag) throw new NotFoundException('Skill tag not found');
    await this.skillTagRepository.remove(skillTag);
  }

  async getNotifications(userId: number): Promise<Notification_Applicant[]> {
    return this.notificationRepository.find({
      where: { user_id: userId },
    });
  }

  async markNotificationAsRead(
    userId: number,
    notificationId: number,
  ): Promise<Notification_Applicant> {
    const checkTheExistingOne = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });
    if (!checkTheExistingOne)
      throw new NotFoundException('Notification not found');
    checkTheExistingOne.is_read = true;
    return this.notificationRepository.save(checkTheExistingOne);
  }

  async createJobAlert(
    userId: number,
    createJobAlertDto: CreateJobAlertDto,
  ): Promise<JobAlert> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    const jobAlert = this.jobAlertRepository.create({
      job_seeker_id: userId,
      ...createJobAlertDto,
    });
    return this.jobAlertRepository.save(jobAlert);
  }

  async getJobAlerts(userId: number): Promise<JobAlert[]> {
    return this.jobAlertRepository.find({
      where: { job_seeker_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async addPortfolio(
    userId: number,
    createPortfolioDto: CreatePortfolioDto,
  ): Promise<Portfolio> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    const portfolio = this.portfolioRepository.create({
      job_seeker_id: userId,
      ...createPortfolioDto,
    });
    return this.portfolioRepository.save(portfolio);
  }

  async updatePortfolio(
    userId: number,
    portfolioId: number,
    createPortfolioDto: CreatePortfolioDto,
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId, job_seeker_id: userId },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    Object.assign(portfolio, createPortfolioDto);
    return this.portfolioRepository.save(portfolio);
  }

  async deletePortfolio(userId: number, portfolioId: number): Promise<void> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId, job_seeker_id: userId },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    await this.portfolioRepository.remove(portfolio);
  }

  async getSocialLinks(userId: number): Promise<SocialLink[]> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
      relations: ['socialLinks'],
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');
    return jobSeeker.socialLinks || [];
  }

  async addSocialLink(
    userId: number,
    dto: { url: string; platform?: string },
  ): Promise<SocialLink> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');
    const socialLink = this.socialLinkRepository.create({
      job_seeker_id: jobSeeker.id,
      jobSeeker,
      url: dto.url,
      platform: dto.platform,
    });
    return this.socialLinkRepository.save(socialLink);
  }

  // DELETE all social links
  async deleteSocialLink(userId: number, socialLinkId: number): Promise<void> {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { id: socialLinkId, job_seeker_id: userId },
    });
    if (!socialLink) throw new NotFoundException('Social link not found');
    await this.socialLinkRepository.remove(socialLink);
  }

  async updateSocialLink(
    userId: number,
    socialLinkId: number,
    updateSocialLinkDto: UpdateSocialLinkDto,
  ): Promise<SocialLink> {
    const socialLink = await this.socialLinkRepository.findOne({
      where: { id: socialLinkId, job_seeker_id: userId },
    });
    if (!socialLink) throw new NotFoundException('Social link not found');
    Object.assign(socialLink, updateSocialLinkDto);
    return this.socialLinkRepository.save(socialLink);
  }
}
