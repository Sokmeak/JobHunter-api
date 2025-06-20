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
import { Job } from './entities/job.entity';
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

@Injectable()
export class JobSeekersService {
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
    private filesService: FilesService,
  ) {}

  async createJobSeeker(
    userId: number,
    createJobSeekerDto: CreateJobSeekerDto,
  ): Promise<JobSeeker> {
    const jobSeeker = this.jobSeekerRepository.create({
      user_id: userId,
      ...createJobSeekerDto,
    });
    log(jobSeeker);
    return this.jobSeekerRepository.save(jobSeeker);
  }

  async updateJobSeeker(
    userId: number,
    updateJobSeekerDto: CreateJobSeekerDto,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
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
      ],
    });

    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    // for (const resume of jobSeeker.resumes) {
    //   const resumeFileName = resume.resume_url.split('/').pop() || '';
    //   resume['thumbnail_url'] = await this.filesService.getFileUrl(
    //     resumeFileName,
    //     'thumbnail',
    //   );
    // }
    // if (jobSeeker.profile_image) {
    //   jobSeeker['profile_image_thumbnail'] = await this.filesService.getFileUrl(
    //     jobSeeker.profile_image.split('/').pop() ?? '',
    //     'thumbnail',
    //   );
    // }
    return jobSeeker;
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
      where: { id: +resumeId, job_seeker_id: userId },
    });
    if (!resume) throw new NotFoundException('Resume not found');
    await this.filesService.deleteFile(
      resume.resume_url.split('/').pop() ?? '',
    );
    await this.resumeRepository.delete(Number(resumeId));
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
      where: { id: Number(createJobApplicationDto.job_id) },
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
      user_id: +userId,
      title: 'Job Application Submitted',
      message: `Your application for ${job.title} has been submitted successfully.`,
    };

    const notification = this.notificationRepository.create(notificationData);
    await this.notificationRepository.save(notification);

    return savedApplication;
  }

  async getApplicationStatus(
    userId: number,
    applicationId: string,
  ): Promise<JobApplication> {
    const application = await this.jobApplicationRepository.findOne({
      where: { id: +applicationId, job_seeker_id: userId },
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
      where: { id: Number(createSavedJobDto.job_id) },
    });
    if (!job) throw new NotFoundException('Job not found');

    const existingSavedJob = await this.savedJobRepository.findOne({
      where: { job_seeker_id: +userId, job_id: createSavedJobDto.job_id },
    });

    if (existingSavedJob) throw new BadRequestException('Job already saved');

    const savedJob = this.savedJobRepository.create({
      job_seeker_id: +userId,
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
    invitationId: string,
    updateInterviewInvitationDto: UpdateInterviewInvitationDto,
  ): Promise<InterviewInvitation> {
    const invitation = await this.interviewInvitationRepository.findOne({
      where: { id: +invitationId, job_seeker_id: userId },
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
      user_id: +userId,
      title: `Interview ${updateInterviewInvitationDto.invitation_status}`,
      message: `You have ${updateInterviewInvitationDto.invitation_status} an interview invitation for ${invitation.job.title}.`,
    };
    const notification = this.notificationRepository.create(notificationData);
    await this.notificationRepository.save(notification);

    return updatedInvitation;
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
      where: { id: +educationId, job_seeker_id: userId },
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
    experienceId: string,
    createWorkExperienceDto: CreateWorkExperienceDto,
  ): Promise<WorkExperience> {
    const experience = await this.workExperienceRepository.findOne({
      where: { id: +experienceId, job_seeker_id: userId },
    });
    if (!experience) throw new NotFoundException('Work experience not found');
    Object.assign(experience, createWorkExperienceDto);
    return this.workExperienceRepository.save(experience);
  }

  async deleteWorkExperience(
    userId: number,
    experienceId: string,
  ): Promise<void> {
    const experience = await this.workExperienceRepository.findOne({
      where: { id: +experienceId, job_seeker_id: userId },
    });
    if (!experience) throw new NotFoundException('Work experience not found');
    await this.workExperienceRepository.remove(experience);
  }

  async addSkillTag(
    userId: number,
    createSkillTagDto: CreateSkillTagDto,
  ): Promise<SkillTag> {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { user_id: userId },
    });
    if (!jobSeeker) throw new NotFoundException('Job seeker not found');

    const skill = this.skillTagRepository.create({
      job_seeker_id: userId,
      ...createSkillTagDto,
    });
    return this.skillTagRepository.save(skill);
  }

  async deleteSkillTag(userId: number, skillId: number): Promise<void> {
    const skill = await this.skillTagRepository.findOne({
      where: { id: skillId, job_seeker_id: userId },
    });
    if (!skill) throw new NotFoundException('Skill tag not found');
    await this.skillTagRepository.remove(skill);
  }

  async getNotifications(userId: string): Promise<Notification_Applicant[]> {
    return this.notificationRepository.find({
      where: { user_id: +userId },
    });
  }

  async markNotificationAsRead(
    userId: string,
    notificationId: string,
  ): Promise<Notification_Applicant> {
    const checkTheExistingOne = await this.notificationRepository.findOne({
      where: {
        id: +notificationId,
        user_id: +userId,
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
}
