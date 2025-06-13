// import {
//   ConflictException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Company } from './entities/company.entity';
// import { CreateCompanyDto } from './dtos/create-company.dto';
// import { UpdateCompanyDto } from './dtos/update-company.dto';
// import { User } from '../users/entities/user.entity';

// import { plainToInstance } from 'class-transformer';
// import { CompanyResponseDto } from './dtos/company-response.dto';

// @Injectable()
// export class CompaniesService {
//   constructor(
//     @InjectRepository(Company)
//     private readonly companyRepository: Repository<Company>,

//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async create(
//     createCompanyDto: CreateCompanyDto,
//   ): Promise<CompanyResponseDto> {
//     const user = await this.userRepository.findOneBy({
//       id: createCompanyDto.userId,
//     });

//     if (!user) throw new NotFoundException('User not found');

//     const existing = await this.companyRepository.findOne({
//       where: { user: { id: user.id } },
//     });
//     if (existing) throw new ConflictException('User already has a company');

//     const company = this.companyRepository.create({
//       ...createCompanyDto,
//       user,
//     });

//     const savedCompany = await this.companyRepository.save(company);

//     return plainToInstance(CompanyResponseDto, {
//       ...savedCompany,
//       hr_contact: {
//         name: user.username,
//         email: user.email,
//       },
//     });
//   }

//   async findAll(): Promise<CompanyResponseDto[]> {
//     const companies = await this.companyRepository.find({
//       relations: ['user'],
//     });

//     return companies.map((company) =>
//       plainToInstance(CompanyResponseDto, {
//         ...company,
//         hr_contact: {
//           name: company.user?.username,
//           email: company.user?.email,
//         },
//       }),
//     );
//   }

//   async findOne(id: number): Promise<CompanyResponseDto> {
//     const company = await this.companyRepository.findOne({
//       where: { id },
//       relations: ['user'],
//     });

//     if (!company) {
//       throw new NotFoundException(`Company with id ${id} not found!`);
//     }

//     return plainToInstance(CompanyResponseDto, {
//       ...company,
//       hr_contact: {
//         name: company.user?.username,
//         email: company.user?.email,
//       },
//     });
//   }

//   async update(
//     id: number,
//     updateCompanyDto: UpdateCompanyDto,
//   ): Promise<CompanyResponseDto> {
//     const company = await this.companyRepository.findOne({
//       where: { id },
//       relations: ['user'],
//     });
//     if (!company) throw new NotFoundException('Company not found');

//     Object.assign(company, updateCompanyDto);

//     const updatedCompany = await this.companyRepository.save(company);

//     return plainToInstance(CompanyResponseDto, {
//       ...updatedCompany,
//       hr_contact: {
//         name: updatedCompany.user?.username,
//         email: updatedCompany.user?.email,
//       },
//     });
//   }

//   async remove(id: number): Promise<void> {
//     const company = await this.companyRepository.findOneBy({ id });
//     if (!company) throw new NotFoundException('Company not found');

//     await this.companyRepository.remove(company);
//   }

//   async findByUserId(userId: number): Promise<CompanyResponseDto> {
//     const company = await this.companyRepository.findOne({
//       where: { user: { id: userId } },
//       relations: ['user'],
//     });

//     if (!company) {
//       throw new NotFoundException(
//         `Company for user with id ${userId} not found!`,
//       );
//     }

//     return plainToInstance(CompanyResponseDto, {
//       ...company,
//       hr_contact: {
//         name: company.user?.username,
//         email: company.user?.email,
//       },
//     });
//   }
// }
// src/companies/companies.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Company } from './entities/company.entity';
import { Member } from './entities/member.entity';
import { Technology } from './entities/technology.entity';
import { CompanyTechStack } from './entities/company-tech-stack.entity';
import { OfficeLocation } from './entities/office-location.entity';
import { OfficeImage } from './entities/office-image.entity';
import { JobBenefit } from './entities/job-benefit.entity';
import { CompanyDocument } from './entities/company-document.entity';
import { Job } from './entities/job.entity';
import { JobApplication } from './entities/job-application.entity';
import { Interview } from './entities/interview.entity';
import { Notification } from './entities/notification.entity';
import { FilesService } from '../files/files.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateOfficeLocationDto } from './dto/create-office-location.dto';
import { UpdateOfficeLocationDto } from './dto/update-office-location.dto';
import { CreateJobBenefitDto } from './dto/create-job-benefit.dto';
import { UpdateJobBenefitDto } from './dto/update-job-benefit.dto';
import { CreateOfficeImageDto } from './dto/create-office-image.dto';
import { UpdateOfficeImageDto } from './dto/update-office-image.dto';
import { CreateCompanyDocumentDto } from './dto/create-document.dto';
import { UpdateCompanyDocumentDto } from './dto/update-document.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { log } from 'console';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Technology)
    private technologyRepository: Repository<Technology>,
    @InjectRepository(CompanyTechStack)
    private companyTechStackRepository: Repository<CompanyTechStack>,
    @InjectRepository(OfficeLocation)
    private officeLocationRepository: Repository<OfficeLocation>,
    @InjectRepository(OfficeImage)
    private officeImageRepository: Repository<OfficeImage>,
    @InjectRepository(JobBenefit)
    private jobBenefitRepository: Repository<JobBenefit>,
    @InjectRepository(CompanyDocument)
    private companyDocumentRepository: Repository<CompanyDocument>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private filesService: FilesService,
  ) {}

  private readonly logger = new Logger(CompaniesService.name);

  async createCompany(
    userId: string,
    createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    const existingCompany = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (existingCompany)
      throw new BadRequestException('User already has a company');
    const company = this.companyRepository.create({
      user_id: userId,
      ...createCompanyDto,
    });
    return this.companyRepository.save(company);
  }

  async updateCompany(
    userId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async uploadCompanyMedia(
    userId: string,
    file: Express.Multer.File,
    type: 'logo' | 'image',
  ): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    if (
      !['image/png', 'image/jpeg'].includes(file.mimetype) ||
      file.size > 10 * 1024 * 1024
    ) {
      throw new BadRequestException(
        'Invalid image format or size exceeds 10MB',
      );
    }
    const uploadResult = await this.filesService.uploadFile(file);
    if (type === 'logo') {
      company.brand_logo = uploadResult.originalPath;
    } else {
      company.companiesImages = uploadResult.originalPath;
    }
    const savedCompany = await this.companyRepository.save(company);
    savedCompany[
      `${type === 'logo' ? 'brand_logo' : 'companiesImages'}_thumbnail`
    ] = await this.filesService.getFileUrl(uploadResult.fileName, 'thumbnail');
    return savedCompany;
  }

  async getCompanyById(id: number): Promise<
    Company & {
      officeImages: Array<{
        id: number;
        image_url: string;
        thumbnail_url: string;
        caption?: string;
      }>;
    }
  > {
    const company = await this.companyRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'members',
        'technologies',
        'officeLocations',
        'officeLocations.images',
        'benefits',
        'documents',
        'jobs',
      ],
    });

    if (!company) throw new NotFoundException('Company not found or inactive');

    // Aggregate office images from all office locations
    const officeImages = company.officeLocations.flatMap((location) =>
      location.images.map((image) => ({
        id: image.id,
        image_url: image.image_url,
        thumbnail_url: '',
        caption: image.caption,
      })),
    );

    // Generate thumbnails for office images
    for (const officeImage of officeImages) {
      officeImage.thumbnail_url = await this.filesService.getFileUrl(
        officeImage.image_url.split('/').pop() ?? '',
        'thumbnail',
      );
    }

    // Generate thumbnails for brand_logo and companiesImages
    if (company.brand_logo) {
      company['brand_logo_thumbnail'] = await this.filesService.getFileUrl(
        company.brand_logo.split('/').pop() ?? '',
        'thumbnail',
      );
    }
    if (company.companiesImages) {
      company['companiesImages_thumbnail'] = await this.filesService.getFileUrl(
        company.companiesImages.split('/').pop() ?? '',
        'thumbnail',
      );
    }
    for (const document of company.documents) {
      document['document_url_thumbnail'] = await this.filesService.getFileUrl(
        document.document_url.split('/').pop() ?? '',
        'thumbnail',
      );
    }

    // Return company with aggregated officeImages
    return { ...(company as any), officeImages };
  }

  async getCompany(userId: string): Promise<
    Company & {
      officeImages: Array<{
        id: number;
        image_url: string;
        thumbnail_url: string;
        caption?: string;
      }>;
    }
  > {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId, isActive: true },
      relations: [
        'members',
        'technologies',
        'officeLocations',
        'officeLocations.images',
        'benefits',
        'documents',
        'jobs',
      ],
    });

    if (!company) throw new NotFoundException('Company not found or inactive');

    // Aggregate office images from all office locations
    const officeImages = company.officeLocations.flatMap((location) =>
      location.images.map((image) => ({
        id: image.id,
        image_url: image.image_url,
        thumbnail_url: '',
        caption: image.caption,
      })),
    );

    // Generate thumbnails for office images
    for (const officeImage of officeImages) {
      officeImage.thumbnail_url = await this.filesService.getFileUrl(
        officeImage.image_url.split('/').pop() ?? '',
        'thumbnail',
      );
    }

    // Generate thumbnails for brand_logo and companiesImages
    if (company.brand_logo) {
      company['brand_logo_thumbnail'] = await this.filesService.getFileUrl(
        company.brand_logo.split('/').pop() ?? '',
        'thumbnail',
      );
    }
    if (company.companiesImages) {
      company['companiesImages_thumbnail'] = await this.filesService.getFileUrl(
        company.companiesImages.split('/').pop() ?? '',
        'thumbnail',
      );
    }
    for (const document of company.documents) {
      document['document_url_thumbnail'] = await this.filesService.getFileUrl(
        document.document_url.split('/').pop() ?? '',
        'thumbnail',
      );
    }

    // Return company with aggregated officeImages
    return { ...(company as any), officeImages };
  }

  async getCompanies(
    page: number = 1,
    limit: number = 10,
    industry?: string,
  ): Promise<{
    companies: Array<
      Company & {
        officeImages: Array<{
          id: number;
          image_url: string;
          thumbnail_url: string;
          caption?: string;
        }>;
      }
    >;
    total: number;
  }> {
    const query = this.companyRepository
      .createQueryBuilder('company')
      .where('company.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('company.members', 'members')
      .leftJoinAndSelect('company.technologies', 'technologies')
      .leftJoinAndSelect('company.officeLocations', 'officeLocations')
      .leftJoinAndSelect('officeLocations.images', 'images')
      .leftJoinAndSelect('company.benefits', 'benefits')
      .leftJoinAndSelect('company.documents', 'documents');
    if (industry)
      query.andWhere('company.industry LIKE :industry', {
        industry: `%${industry}%`,
      });
    query.skip((page - 1) * limit).take(limit);
    const [companies, total] = await query.getManyAndCount();

    // Aggregate office images for each company
    for (const company of companies) {
      const officeImages = company.officeLocations.flatMap((location) =>
        location.images.map((image) => ({
          id: image.id,
          image_url: image.image_url,
          thumbnail_url: '',
          caption: image.caption,
        })),
      );

      // Generate thumbnails for office images
      for (const officeImage of officeImages) {
        officeImage.thumbnail_url = await this.filesService.getFileUrl(
          officeImage.image_url.split('/').pop() ?? '',
          'thumbnail',
        );
      }

      // Attach officeImages to company
      (company as any).officeImages = officeImages;

      // Generate thumbnails for brand_logo and companiesImages
      if (company.brand_logo) {
        company['brand_logo_thumbnail'] = await this.filesService.getFileUrl(
          company.brand_logo.split('/').pop() ?? '',
          'thumbnail',
        );
      }
      if (company.companiesImages) {
        company['companiesImages_thumbnail'] =
          await this.filesService.getFileUrl(
            company.companiesImages.split('/').pop() ?? '',
            'thumbnail',
          );
      }
      for (const document of company.documents) {
        document['document_url_thumbnail'] = await this.filesService.getFileUrl(
          document.document_url.split('/').pop() ?? '',
          'thumbnail',
        );
      }
    }

    return { companies: companies as any, total };
  }

  async deleteCompany(userId: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    await this.companyRepository.update(
      { user_id: userId },
      { isActive: false },
    );
  }
  async addMember(
    userId: string,
    createMemberDto: CreateMemberDto,
    file?: Express.Multer.File,
  ): Promise<Member> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    if (
      file &&
      (!['image/png', 'image/jpeg'].includes(file.mimetype) ||
        file.size > 5 * 1024 * 1024)
    ) {
      throw new BadRequestException(
        'Invalid profile image format or size exceeds 5MB',
      );
    }
    const profileImg = file
      ? (await this.filesService.uploadFile(file)).originalPath
      : undefined;
    const member = this.memberRepository.create({
      company,
      company_id: company.id,
      ...createMemberDto,
      profile_img_url: profileImg,
    });
    const savedMember = await this.memberRepository.save(member);
    if (profileImg) {
      savedMember['profile_img_url_thumbnail'] =
        await this.filesService.getFileUrl(
          profileImg.split('/').pop() ?? '',
          'thumbnail',
        );
    }
    return savedMember;
  }

  async getMembers(userId: string): Promise<Member[]> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const members = await this.memberRepository.find({
      where: { company_id: company.id },
    });
    for (const member of members) {
      if (member.profile_img_url) {
        member['profile_img_url_thumbnail'] =
          await this.filesService.getFileUrl(
            member.profile_img_url.split('/').pop() ?? '',
            'thumbnail',
          );
      }
    }
    return members;
  }

  async updateMember(
    userId: string,
    memberId: number,
    updateMemberDto: UpdateMemberDto,
    file?: Express.Multer.File,
  ): Promise<Member> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const member = await this.memberRepository.findOne({
      where: { id: memberId, company_id: company.id },
    });
    if (!member) throw new NotFoundException('Member not found');
    if (
      file &&
      (!['image/png', 'image/jpeg'].includes(file.mimetype) ||
        file.size > 5 * 1024 * 1024)
    ) {
      throw new BadRequestException(
        'Invalid profile image format or size exceeds 5MB',
      );
    }
    const profileImg = file
      ? (await this.filesService.uploadFile(file)).originalPath
      : member.profile_img_url;
    Object.assign(member, { ...updateMemberDto, profile_img_url: profileImg });
    const savedMember = await this.memberRepository.save(member);
    if (profileImg) {
      savedMember['profile_img_url_thumbnail'] =
        await this.filesService.getFileUrl(
          profileImg.split('/').pop() ?? '',
          'thumbnail',
        );
    }
    return savedMember;
  }

  async deleteMember(userId: string, memberId: number): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const member = await this.memberRepository.findOne({
      where: { id: memberId, company_id: company.id },
    });
    if (!member) throw new NotFoundException('Member not found');
    await this.memberRepository.delete(memberId);
  }

  async addTechStack(userId: string, technologyId: number): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const technology = await this.technologyRepository.findOne({
      where: { id: technologyId },
    });
    if (!technology) throw new NotFoundException('Technology not found');
    const existingTechStack = await this.companyTechStackRepository.findOne({
      where: { id: company.id, technology_id: technologyId },
    });
    if (existingTechStack)
      throw new BadRequestException('Technology already in tech stack');
    const techStack = this.companyTechStackRepository.create({
      id: company.id,
      technology_id: technologyId,
      company,
      technology,
    });
    await this.companyTechStackRepository.save(techStack);
  }

  async getTechStack(userId: string): Promise<Technology[]> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const techStacks = await this.companyTechStackRepository.find({
      where: { id: company.id },
      relations: ['technology'],
    });
    return techStacks.map((ts) => ts.technology);
  }

  async deleteTechStack(userId: string, technologyId: number): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const techStack = await this.companyTechStackRepository.findOne({
      where: { id: company.id, technology_id: technologyId },
    });
    if (!techStack)
      throw new NotFoundException('Technology not found in tech stack');
    await this.companyTechStackRepository.delete({
      id: company.id,
      technology_id: technologyId,
    });
  }

  async addOfficeLocation(
    userId: string,
    createOfficeLocationDto: CreateOfficeLocationDto,
  ): Promise<OfficeLocation> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    if (createOfficeLocationDto.is_headquarters) {
      await this.officeLocationRepository.update(
        { company_id: company.id, is_headquarters: true },
        { is_headquarters: false },
      );
    }
    const location = this.officeLocationRepository.create({
      company,
      company_id: company.id,
      ...createOfficeLocationDto,
    });
    return this.officeLocationRepository.save(location);
  }

  async getOfficeLocations(userId: string): Promise<OfficeLocation[]> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    return this.officeLocationRepository.find({
      where: { company_id: company.id },
      relations: ['images'],
    });
  }

  async updateOfficeLocation(
    userId: string,
    locationId: number,
    updateOfficeLocationDto: UpdateOfficeLocationDto,
  ): Promise<OfficeLocation> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const location = await this.officeLocationRepository.findOne({
      where: { id: locationId, company_id: company.id },
    });
    if (!location) throw new NotFoundException('Office location not found');
    if (updateOfficeLocationDto.is_headquarters) {
      await this.officeLocationRepository.update(
        { company_id: company.id, is_headquarters: true },
        { is_headquarters: false },
      );
    }
    Object.assign(location, updateOfficeLocationDto);
    return this.officeLocationRepository.save(location);
  }

  async deleteOfficeLocation(
    userId: string,
    locationId: number,
  ): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const location = await this.officeLocationRepository.findOne({
      where: { id: locationId, company_id: company.id },
    });
    if (!location) throw new NotFoundException('Office location not found');
    await this.officeLocationRepository.delete(locationId);
  }

  async addOfficeImage(
    userId: string,
    locationId: number,
    createOfficeImageDto: CreateOfficeImageDto,
    file: Express.Multer.File,
  ): Promise<OfficeImage> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const location = await this.officeLocationRepository.findOne({
      where: { id: locationId, company_id: company.id },
    });
    if (!location) throw new NotFoundException('Office location not found');
    if (
      !['image/png', 'image/jpeg'].includes(file.mimetype) ||
      file.size > 10 * 1024 * 1024
    ) {
      throw new BadRequestException(
        'Invalid image format or size exceeds 10MB',
      );
    }
    const uploadResult = await this.filesService.uploadFile(file);
    const image = this.officeImageRepository.create({
      officeLocation: location,
      office_location_id: locationId,
      image_url: uploadResult.originalPath,
      ...createOfficeImageDto,
    });
    const savedImage = await this.officeImageRepository.save(image);
    savedImage['image_url_thumbnail'] = await this.filesService.getFileUrl(
      uploadResult.fileName,
      'thumbnail',
    );
    return savedImage;
  }

  async getOfficeImages(
    userId: string,
    locationId: number,
  ): Promise<OfficeImage[]> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const location = await this.officeLocationRepository.findOne({
      where: { id: locationId, company_id: company.id },
    });
    if (!location) throw new NotFoundException('Office location not found');
    const images = await this.officeImageRepository.find({
      where: { office_location_id: locationId },
    });
    for (const image of images) {
      image['image_url_thumbnail'] = await this.filesService.getFileUrl(
        image.image_url.split('/').pop() ?? '',
        'thumbnail',
      );
    }
    return images;
  }

  async updateOfficeImage(
    userId: string,
    locationId: number,
    imageId: number,
    updateOfficeImageDto: UpdateOfficeImageDto,
    file?: Express.Multer.File,
  ): Promise<OfficeImage> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const image = await this.officeImageRepository.findOne({
      where: { id: imageId, office_location_id: locationId },
    });
    if (!image) throw new NotFoundException('Office image not found');
    if (
      file &&
      (!['image/png', 'image/jpeg'].includes(file.mimetype) ||
        file.size > 10 * 1024 * 1024)
    ) {
      throw new BadRequestException(
        'Invalid image format or size exceeds 10MB',
      );
    }
    const imageUrl = file
      ? (await this.filesService.uploadFile(file)).originalPath
      : image.image_url;
    Object.assign(image, { ...updateOfficeImageDto, image_url: imageUrl });
    const savedImage = await this.officeImageRepository.save(image);
    savedImage['image_url_thumbnail'] = await this.filesService.getFileUrl(
      imageUrl.split('/').pop() ?? '',
      'thumbnail',
    );
    return savedImage;
  }

  async deleteOfficeImage(
    userId: string,
    locationId: number,
    imageId: number,
  ): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const image = await this.officeImageRepository.findOne({
      where: { id: imageId, office_location_id: locationId },
    });
    if (!image) throw new NotFoundException('Office image not found');
    await this.officeImageRepository.delete(imageId);
  }

  async addJobBenefit(
    userId: string,
    createJobBenefitDto: CreateJobBenefitDto,
    file?: Express.Multer.File,
  ): Promise<JobBenefit> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    if (
      file &&
      (!['image/png', 'image/jpeg'].includes(file.mimetype) ||
        file.size > 2 * 1024 * 1024)
    ) {
      throw new BadRequestException('Invalid icon format or size exceeds 2MB');
    }
    const icon = file
      ? (await this.filesService.uploadFile(file)).originalPath
      : createJobBenefitDto.icon;
    const benefit = this.jobBenefitRepository.create({
      company,
      company_id: company.id,
      ...createJobBenefitDto,
      icon,
    });
    const savedBenefit = await this.jobBenefitRepository.save(benefit);
    if (icon) {
      savedBenefit['icon_thumbnail'] = await this.filesService.getFileUrl(
        icon.split('/').pop() ?? '',
        'thumbnail',
      );
    }
    return savedBenefit;
  }

  async getJobBenefits(userId: string): Promise<JobBenefit[]> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const benefits = await this.jobBenefitRepository.find({
      where: { company_id: company.id },
    });
    for (const benefit of benefits) {
      if (benefit.icon) {
        benefit['icon_thumbnail'] = await this.filesService.getFileUrl(
          benefit.icon.split('/').pop() ?? '',
          'thumbnail',
        );
      }
    }
    return benefits;
  }

  async updateJobBenefit(
    userId: string,
    benefitId: number,
    updateJobBenefitDto: UpdateJobBenefitDto,
    file?: Express.Multer.File,
  ): Promise<JobBenefit> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const benefit = await this.jobBenefitRepository.findOne({
      where: { id: benefitId, company_id: company.id },
    });
    if (!benefit) throw new NotFoundException('Job benefit not found');
    if (
      file &&
      (!['image/png', 'image/jpeg'].includes(file.mimetype) ||
        file.size > 2 * 1024 * 1024)
    ) {
      throw new BadRequestException('Invalid icon format or size exceeds 2MB');
    }
    const icon = file
      ? (await this.filesService.uploadFile(file)).originalPath
      : benefit.icon;
    Object.assign(benefit, { ...updateJobBenefitDto, icon });
    const savedBenefit = await this.jobBenefitRepository.save(benefit);
    if (icon) {
      savedBenefit['icon_thumbnail'] = await this.filesService.getFileUrl(
        icon.split('/').pop() ?? '',
        'thumbnail',
      );
    }
    return savedBenefit;
  }

  async deleteJobBenefit(userId: string, benefitId: number): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const benefit = await this.jobBenefitRepository.findOne({
      where: { id: benefitId, company_id: company.id },
    });
    if (!benefit) throw new NotFoundException('Job benefit not found');
    await this.jobBenefitRepository.delete(benefitId);
  }

  async addCompanyDocument(
    userId: string,
    createCompanyDocumentDto: CreateCompanyDocumentDto,
    file: Express.Multer.File,
  ): Promise<CompanyDocument> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    if (
      !['application/pdf', 'image/png', 'image/jpeg'].includes(file.mimetype) ||
      file.size > 10 * 1024 * 1024
    ) {
      throw new BadRequestException(
        'Invalid document format or size exceeds 10MB',
      );
    }
    const uploadResult = await this.filesService.uploadFile(file);
    const document = this.companyDocumentRepository.create({
      company,
      company_id: company.id,
      document_name: createCompanyDocumentDto.document_name,
      document_url: uploadResult.originalPath,
    });
    const savedDocument = await this.companyDocumentRepository.save(document);
    savedDocument['document_url_thumbnail'] =
      await this.filesService.getFileUrl(uploadResult.fileName, 'thumbnail');
    return savedDocument;
  }

  async getCompanyDocuments(userId: string): Promise<CompanyDocument[]> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const documents = await this.companyDocumentRepository.find({
      where: { company_id: company.id },
    });
    for (const document of documents) {
      document['document_url_thumbnail'] = await this.filesService.getFileUrl(
        document.document_url.split('/').pop() ?? '',
        'thumbnail',
      );
    }
    return documents;
  }

  async updateCompanyDocument(
    userId: string,
    documentId: number,
    updateCompanyDocumentDto: UpdateCompanyDocumentDto,
    file?: Express.Multer.File,
  ): Promise<CompanyDocument> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const document = await this.companyDocumentRepository.findOne({
      where: { id: documentId, company_id: company.id },
    });
    if (!document) throw new NotFoundException('Document not found');
    if (
      file &&
      (!['application/pdf', 'image/png', 'image/jpeg'].includes(
        file.mimetype,
      ) ||
        file.size > 10 * 1024 * 1024)
    ) {
      throw new BadRequestException(
        'Invalid document format or size exceeds 10MB',
      );
    }
    const documentUrl = file
      ? (await this.filesService.uploadFile(file)).originalPath
      : document.document_url;
    Object.assign(document, {
      ...updateCompanyDocumentDto,
      document_url: documentUrl,
    });
    const savedDocument = await this.companyDocumentRepository.save(document);
    savedDocument['document_url_thumbnail'] =
      await this.filesService.getFileUrl(
        documentUrl.split('/').pop() ?? '',
        'thumbnail',
      );
    return savedDocument;
  }

  async deleteCompanyDocument(
    userId: string,
    documentId: number,
  ): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const document = await this.companyDocumentRepository.findOne({
      where: { id: documentId, company_id: company.id },
    });
    if (!document) throw new NotFoundException('Document not found');
    await this.companyDocumentRepository.delete(documentId);
  }

  async createJob(userId: string, createJobDto: CreateJobDto): Promise<Job> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const job = this.jobRepository.create({
      company,
      company_id: company.id,
      ...createJobDto,
    });
    return this.jobRepository.save(job);
  }

  async updateJob(
    userId: string,
    jobId: number,
    updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const job = await this.jobRepository.findOne({
      where: { id: jobId, company_id: company.id },
    });
    if (!job) throw new NotFoundException('Job not found');
    Object.assign(job, updateJobDto);
    return this.jobRepository.save(job);
  }

  async deleteJob(userId: string, jobId: number): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const job = await this.jobRepository.findOne({
      where: { id: jobId, company_id: company.id },
    });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobRepository.delete(jobId);
  }

  async getJobs(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ jobs: Job[]; total: number }> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const [jobs, total] = await this.jobRepository.findAndCount({
      where: { company_id: company.id },
      relations: ['applications'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { jobs, total };
  }

  async getJobApplications(
    userId: string,
    jobId: number,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ applications: JobApplication[]; total: number }> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const job = await this.jobRepository.findOne({
      where: { id: jobId, company_id: company.id },
    });
    if (!job) throw new NotFoundException('Job not found');
    const query = this.jobApplicationRepository
      .createQueryBuilder('application')
      .where('application.job_id = :jobId', { jobId })
      .leftJoinAndSelect('application.user', 'user');
    if (status) query.andWhere('application.status = :status', { status });
    query.skip((page - 1) * limit).take(limit);
    const [applications, total] = await query.getManyAndCount();
    for (const application of applications) {
      if (application.resume_url) {
        application['resume_url_thumbnail'] =
          await this.filesService.getFileUrl(
            application.resume_url.split('/').pop() ?? '',
            'thumbnail',
          );
      }
    }
    return { applications, total };
  }

  async updateApplicationStatus(
    userId: string,
    applicationId: number,
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ): Promise<JobApplication> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const application = await this.jobApplicationRepository.findOne({
      where: { id: applicationId },
      relations: ['job'],
    });
    if (!application || application.job.company_id !== company.id)
      throw new NotFoundException('Application not found');
    application.status = updateApplicationStatusDto.status;
    const savedApplication =
      await this.jobApplicationRepository.save(application);
    if (savedApplication.resume_url) {
      savedApplication['resume_url_thumbnail'] =
        await this.filesService.getFileUrl(
          savedApplication.resume_url.split('/').pop() ?? '',
          'thumbnail',
        );
    }
    await this.notificationRepository.save({
      user_id: savedApplication.user_id,
      title: `Application Status Updated`,
      message: `Your application for ${application.job.title} has been ${updateApplicationStatusDto.status}.`,
    });
    return savedApplication;
  }

  async scheduleInterview(
    userId: string,
    applicationId: number,
    scheduleInterviewDto: ScheduleInterviewDto,
  ): Promise<Interview> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const application = await this.jobApplicationRepository.findOne({
      where: { id: applicationId },
      relations: ['job'],
    });
    if (!application || application.job.company_id !== company.id)
      throw new NotFoundException('Application not found');
    const interview = this.interviewRepository.create({
      jobApplication: application,
      job_application_id: applicationId,
      ...scheduleInterviewDto,
    });
    const savedInterview = await this.interviewRepository.save(interview);
    await this.notificationRepository.save({
      user_id: application.user_id,
      title: `Interview Scheduled`,
      message: `An interview for ${application.job.title} has been scheduled on ${scheduleInterviewDto.schedule_at}.`,
    });
    return savedInterview;
  }

  async getInterviews(
    userId: string,
    jobId?: number,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ interviews: Interview[]; total: number }> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const query = this.interviewRepository
      .createQueryBuilder('interview')
      .leftJoinAndSelect('interview.jobApplication', 'jobApplication')
      .leftJoinAndSelect('jobApplication.job', 'job')
      .where('job.company_id = :companyId', { companyId: company.id });
    if (jobId) query.andWhere('job.id = :jobId', { jobId });
    if (status) query.andWhere('interview.status = :status', { status });
    query.skip((page - 1) * limit).take(limit);
    const [interviews, total] = await query.getManyAndCount();
    return { interviews, total };
  }

  async updateInterviewStatus(
    userId: string,
    interviewId: number,
    status: string,
  ): Promise<Interview> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
      relations: ['jobApplication', 'jobApplication.job'],
    });
    if (!interview || interview.jobApplication.job.company_id !== company.id)
      throw new NotFoundException('Interview not found');
    interview.status = status;
    const savedInterview = await this.interviewRepository.save(interview);
    await this.notificationRepository.save({
      user_id: interview.jobApplication.user_id,
      title: `Interview Status Updated`,
      message: `Your interview for ${interview.jobApplication.job.title} is now ${status}.`,
    });
    return savedInterview;
  }

  async sendNotification(
    userId: string,
    sendNotificationDto: SendNotificationDto,
  ): Promise<Notification> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const notification = this.notificationRepository.create({
      user_id: sendNotificationDto.user_id,
      title: sendNotificationDto.title,
      message: sendNotificationDto.message,
    });
    return this.notificationRepository.save(notification);
  }

  async getAnalytics(userId: string, jobId?: number): Promise<any> {
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.applications', 'applications')
      .where('job.company_id = :companyId', { companyId: company.id });
    if (jobId) query.andWhere('job.id = :jobId', { jobId });
    const jobs = await query.getMany();
    const analytics = {
      totalJobs: jobs.length,
      totalApplications: jobs.reduce(
        (sum, job) => sum + job.applications.length,
        0,
      ),
      totalViews: jobs.reduce((sum, job) => sum + job.views, 0),
      hiringTrends: jobs.map((job) => ({
        jobId: job.id,
        title: job.title,
        applications: job.applications.length,
        views: job.views,
        posted_at: job.posted_at,
      })),
    };
    return analytics;
  }
}
