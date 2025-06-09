import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import { JobSeeker } from './entities/jobseeker.entity';
import { JobApplication } from './application/application.entity';
import { EducationHistory } from './education/education.entity';
import { SkillTag } from './skill/skill.entity';
import { WorkExperience } from './experience/experience.entity';
import { InterviewInvitation } from './interview-invitation/interview-invitation.entity';
import { JobAlert } from './job-alert/job-alert.entity';
import { Job } from './jobs/job.entity';
import { Company } from 'src/companies/entities/company.entity';
import { CreateJobSeekerDto } from './dto/create-jobseeker.dto';
import { CreateJobApplicationDto } from './application/dto/create-job-application.dto';
import { CreateSavedJobDto } from './jobs/dto/create-saved-job.dto';
import { UpdateInterviewInvitationDto } from './interview-invitation/dto/update-interview-invitation.dto';
import { CreateEducationHistoryDto } from './education/dto/create-education.dto';
import { CreateWorkExperienceDto } from './experience/dto/create-experience.dto';
import { CreateSkillTagDto } from './skill/dto/create-skill.dto';
import { CreateJobAlertDto } from './job-alert/dto/create-job-alert.dto';
import { Resume } from './resume/resume.entity';
import { SavedJob } from './save-job/saved-job.entity';
import { InterviewPreference } from './interview-preference/interview-preference.entity';
import { CreateResumeDto } from './resume/dto/create-resume.dto';
import { CreateInterviewPreferenceDto } from './interview-preference/dto/create-interview-preference.dto';
import { CreateNotificationDto } from './notification/dto/create-notification.dto';
import { Notification } from './notification/notification.entity';

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
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
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
    userId: string,
    createJobSeekerDto: CreateJobSeekerDto,
  ): Promise<JobSeeker> {
    const jobSeeker = this.jobSeekerRepository.create({
      user_id: userId,
      ...createJobSeekerDto,
    });
    return this.jobSeekerRepository.save(jobSeeker);
  }

  async updateJobSeeker(
    userId: string,
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
    userId: string,
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

  async getJobSeeker(userId: string): Promise<JobSeeker> {
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

    for (const resume of jobSeeker.resumes) {
      const resumeFileName = resume.resume_url.split('/').pop() || '';
      resume['thumbnail_url'] = await this.filesService.getFileUrl(
        resumeFileName,
        'thumbnail',
      );
    }
    if (jobSeeker.profile_image) {
      jobSeeker['profile_image_thumbnail'] = await this.filesService.getFileUrl(
        jobSeeker.profile_image.split('/').pop() ?? '',
        'thumbnail',
      );
    }
    return jobSeeker;
  }

  async uploadResume(
    userId: string,
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

  async applyForJob(
    userId: string,
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
    userId: string,
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
    userId: string,
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
    userId: string,
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
    userId: string,
  ): Promise<InterviewInvitation[]> {
    return this.interviewInvitationRepository.find({
      where: { job_seeker_id: userId },
      relations: ['job', 'company'],
      order: { created_at: 'DESC' },
    });
  }

  async updateInterviewInvitation(
    userId: string,
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
    userId: string,
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

  async addWorkExperience(
    userId: string,
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

  async addSkillTag(
    userId: string,
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

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user_id: +userId },
    });
  }

  async markNotificationAsRead(
    userId: string,
    notificationId: string,
  ): Promise<Notification> {
    const checkTheExistingOne = await this.notificationRepository.findOne({
      where: {
        id: +notificationId,
        user_id: +userId,
      },
    });

    // const checkTheExistingOne = await this.notificationRepository
    //   .createQueryBuilder('notification')
    //   .leftJoin('notification.user', 'user')
    //   .where('notification.id = :notificationId', {
    //     notificationId: +notificationId,
    //   })
    //   .andWhere('user.id = :userId', { userId: +userId })
    //   .getOne();

    if (!checkTheExistingOne)
      throw new NotFoundException('Notification not found');
    checkTheExistingOne.is_read = true;
    return this.notificationRepository.save(checkTheExistingOne);
  }

  // async searchJobs(searchJobsDto: SearchJobsDto): Promise<Job[] > {
  //   const where: any = {};
  //   if (searchJobsDto.location) {
  //     where.location = Like(`%${searchJobsDto.location}%`);
  //   }
  //   if (searchJobsDto.min_salary || searchJobsDto.max_salary) {
  //     where.salary_min = Between(searchJobsDto.min_salary || 0, searchJobsDto.max_salary || Number.MAX_SAFE_INTEGER);
  //   }
  //   if (searchJobsDto.job_type) {
  //     where.job_type = searchJobsDto.job_type;
  //   }
  //   if (searchJobsDto.industry) {
  //     where.industry = searchJobsDto.industry;
  //   }
  //   if (searchJobsDto.keywords && searchJobsDto.keywords.length > 0) {
  //     where.required_skills = searchJobsDto.keywords.map((keyword) => Like(`%${keyword}%`));
  //   }

  //   return this.jobRepository.find({
  //     where,
  //     relations: ['company'],
  //     order: { created_at: 'DESC' },
  //   });
  // }

  // async getJobRecommendations(userId: string): Promise<Job[]> {
  //   const jobSeeker = await this.jobSeekerRepository.findOne({
  //     where: { user_id: userId },
  //     relations: ['skillTags', 'workExperience'],
  //   });
  //   if (!jobSeeker) throw new NotFoundException('Job seeker not found');

  //   const skills = jobSeeker.skillTags.map((tag) => tag.skill_name);
  //   const experienceTitles = jobSeeker.workExperience.map((exp) => exp.job_title);

  //   return this.jobRepository
  //     .createQueryBuilder('job')
  //     .leftJoinAndSelect('job.company', 'company')
  //     .where('job.required_skills && :skills', { skills })
  //     .orWhere('job.title ILIKE ANY (:titles)', { titles: experienceTitles.map((title) => `%${title}%`) })
  //     .orderBy('job.created_at', 'DESC')
  //     .limit(10)
  //     .getMany();
  // }

  // async getSalaryInsights(industry: string): Promise<{ average_salary: number; job_count: number }> {
  //   const jobs = await this.jobRepository.find({ where: { industry } });
  //   if (jobs.length === 0) {
  //     return { average_salary: 0, job_count: 0 };
  //   }
  //   const totalSalary = jobs.reduce((sum, job) => sum + (job.salary_min + job.salary_max) / 2, 0);
  //   return {
  //     average_salary: Math.round(totalSalary / jobs.length),
  //     job_count: jobs.length,
  //   };
  // }

  // async getCompanyReviews(companyId: string): Promise<string> {
  //   const company = await this.companyRepository.findOne({ where: { id: companyId } });
  //   if (!company) throw new NotFoundException('Company not found');
  //   return company.reviews || 'No reviews available';
  // }

  async createJobAlert(
    userId: string,
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

  async getJobAlerts(userId: string): Promise<JobAlert[]> {
    return this.jobAlertRepository.find({
      where: { job_seeker_id: userId },
      order: { created_at: 'DESC' },
    });
  }
}
