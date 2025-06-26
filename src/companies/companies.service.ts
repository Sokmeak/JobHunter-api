// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   Logger,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Like, In } from 'typeorm';
// import { Company } from './entities/company.entity';
// import { Member } from './entities/member.entity';
// import { Technology } from './technology/technology.entity';
// import { CompanyTechStack } from './entities/company-tech-stack.entity';
// import { OfficeLocation } from './entities/office-location.entity';
// import { OfficeImage } from './entities/office-image.entity';
// import { CompanyDocument } from './entities/company-document.entity';
// import { Job } from './entities/job.entity';
// import { JobApplication } from './entities/job-application.entity';
// import { Interview } from './entities/interview.entity';
// import { Notification } from './entities/notification.entity';
// import { FilesService } from '../files/files.service';
// import { JobhunterSystemService } from '../jobhunter-system/jobhunter-system.service';
// import { CreateCompanyDto } from './dto/create-company.dto';
// import { UpdateCompanyDto } from './dto/update-company.dto';
// import { CreateMemberDto } from './dto/create-member.dto';
// import { UpdateMemberDto } from './dto/update-member.dto';
// import { CreateOfficeLocationDto } from './dto/create-office-location.dto';
// import { UpdateOfficeLocationDto } from './dto/update-office-location.dto';
// import { CreateOfficeImageDto } from './dto/create-office-image.dto';
// import { UpdateOfficeImageDto } from './dto/update-office-image.dto';
// import { CreateCompanyDocumentDto } from './dto/create-document.dto';
// import { UpdateCompanyDocumentDto } from './dto/update-document.dto';
// import { CreateJobDto } from './dto/create-job.dto';
// import { UpdateJobDto } from './dto/update-job.dto';
// import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
// import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
// import { SendNotificationDto } from './dto/send-notification.dto';
// import { CompanyResponseDto } from './dto/company-response.dto';

// @Injectable()
// export class CompaniesService {
//   constructor(
//     @InjectRepository(Company)
//     private companyRepository: Repository<Company>,
//     @InjectRepository(Member)
//     private memberRepository: Repository<Member>,
//     @InjectRepository(Technology)
//     private technologyRepository: Repository<Technology>,
//     @InjectRepository(CompanyTechStack)
//     private companyTechStackRepository: Repository<CompanyTechStack>,
//     @InjectRepository(OfficeLocation)
//     private officeLocationRepository: Repository<OfficeLocation>,
//     @InjectRepository(OfficeImage)
//     private officeImageRepository: Repository<OfficeImage>,
//     @InjectRepository(CompanyDocument)
//     private companyDocumentRepository: Repository<CompanyDocument>,
//     @InjectRepository(Job)
//     private jobRepository: Repository<Job>,
//     @InjectRepository(JobApplication)
//     private jobApplicationRepository: Repository<JobApplication>,
//     @InjectRepository(Interview)
//     private interviewRepository: Repository<Interview>,
//     @InjectRepository(Notification)
//     private notificationRepository: Repository<Notification>,
//     private filesService: FilesService,
//     private jobhunterSystemService: JobhunterSystemService,
//   ) {}

//   private readonly logger = new Logger(CompaniesService.name);

//   async createCompany(
//     userId: string,
//     createCompanyDto: CreateCompanyDto,
//   ): Promise<CompanyResponseDto> {
//     const existingCompany = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (existingCompany)
//       throw new BadRequestException('User already has a company');
//     const company = this.companyRepository.create({
//       ...createCompanyDto,
//     });
//     const savedCompany = await this.companyRepository.save(company);
//     return this.jobhunterSystemService.enhanceCompany(savedCompany);
//   }

//   async updateCompany(
//     userId: string,
//     updateCompanyDto: UpdateCompanyDto,
//   ): Promise<CompanyResponseDto> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     Object.assign(company, updateCompanyDto);
//     const savedCompany = await this.companyRepository.save(company);
//     return this.jobhunterSystemService.enhanceCompany(savedCompany);
//   }

//   async uploadCompanyMedia(
//     userId: string,
//     file: Express.Multer.File,
//     type: 'logo' | 'image',
//   ): Promise<CompanyResponseDto> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     if (
//       !['image/png', 'image/jpeg'].includes(file.mimetype) ||
//       file.size > 10 * 1024 * 1024
//     ) {
//       throw new BadRequestException(
//         'Invalid image format or size exceeds 10MB',
//       );
//     }
//     const uploadResult = await this.filesService.uploadFile(file);
//     if (type === 'logo') {
//       company.brand_logo = uploadResult.originalPath;
//     }
//     const savedCompany = await this.companyRepository.save(company);
//     return this.jobhunterSystemService.enhanceCompany(savedCompany);
//   }

//   async getCompany(userId: string): Promise<CompanyResponseDto> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: parseInt(userId), isActive: true },
//       relations: [
//         'members',
//         'officeLocations',
//         'officeLocations.images',
//         'documents',
//         'jobs',
//         'techStacks',
//         'techStacks.technology',
//       ],
//     });

//     if (!company) throw new NotFoundException('Company not found or inactive');

//     this.logger.log(`Fetching company for userId: ${userId}`);
//     return this.jobhunterSystemService.enhanceCompany(company);
//   }

//   async getCompanies(
//     page: number = 1,
//     limit: number = 10,
//     industry?: string,
//   ): Promise<{
//     companies: CompanyResponseDto[];
//     total: number;
//   }> {
//     const query = this.companyRepository
//       .createQueryBuilder('company')
//       .where('company.isActive = :isActive', { isActive: true })
//       .leftJoinAndSelect('company.members', 'members')
//       .leftJoinAndSelect('company.techStacks', 'techStacks')
//       .leftJoinAndSelect('techStacks.technology', 'technology')
//       .leftJoinAndSelect('company.officeLocations', 'officeLocations')
//       .leftJoinAndSelect('officeLocations.images', 'images')
//       .leftJoinAndSelect('company.documents', 'documents')
//       .leftJoinAndSelect('company.jobs', 'jobs');
//     if (industry)
//       query.andWhere('company.industry LIKE :industry', {
//         industry: `%${industry}%`,
//       });
//     query.skip((page - 1) * limit).take(limit);
//     const [companies, total] = await query.getManyAndCount();

//     this.logger.log(
//       `Fetching companies: page=${page}, limit=${limit}, industry=${industry}`,
//     );

//     const enhancedCompanies = await Promise.all(
//       companies.map((company) =>
//         this.jobhunterSystemService.enhanceCompany(company),
//       ),
//     );

//     return { companies: enhancedCompanies, total };
//   }

//   async deleteCompany(userId: string): Promise<void> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     await this.companyRepository.update(
//       { user_id: +userId },
//       { isActive: false },
//     );
//   }

//   async addMember(
//     userId: string,
//     createMemberDto: CreateMemberDto,
//     file?: Express.Multer.File,
//   ): Promise<Member> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     if (
//       file &&
//       (!['image/png', 'image/jpeg'].includes(file.mimetype) ||
//         file.size > 5 * 1024 * 1024)
//     ) {
//       throw new BadRequestException(
//         'Invalid profile image format or size exceeds 5MB',
//       );
//     }
//     const profileImg = file
//       ? (await this.filesService.uploadFile(file)).originalPath
//       : undefined;
//     const member = this.memberRepository.create({
//       company,
//       company_id: company.id,
//       ...createMemberDto,
//       profile_img_url: profileImg,
//     });
//     const savedMember = await this.memberRepository.save(member);
//     if (profileImg) {
//       savedMember['profile_img_url_thumbnail'] =
//         await this.filesService.getFileUrl(
//           profileImg.split('/').pop() ?? '',
//           'thumbnail',
//         );
//     }
//     return savedMember;
//   }

//   async getMembers(userId: string): Promise<Member[]> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: parseInt(userId) },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const members = await this.memberRepository.find({
//       where: { company_id: company.id },
//     });
//     for (const member of members) {
//       if (member.profile_img_url) {
//         member['profile_img_url_thumbnail'] =
//           await this.filesService.getFileUrl(
//             member.profile_img_url.split('/').pop() ?? '',
//             'thumbnail',
//           );
//       }
//     }
//     return members;
//   }

//   async updateMember(
//     userId: string,
//     memberId: number,
//     updateMemberDto: UpdateMemberDto,
//     file?: Express.Multer.File,
//   ): Promise<Member> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const member = await this.memberRepository.findOne({
//       where: { id: memberId, company_id: company.id },
//     });
//     if (!member) throw new NotFoundException('Member not found');
//     if (
//       file &&
//       (!['image/png', 'image/jpeg'].includes(file.mimetype) ||
//         file.size > 5 * 1024 * 1024)
//     ) {
//       throw new BadRequestException(
//         'Invalid profile image format or size exceeds 5MB',
//       );
//     }
//     const profileImg = file
//       ? (await this.filesService.uploadFile(file)).originalPath
//       : member.profile_img_url;
//     Object.assign(member, { ...updateMemberDto, profile_img_url: profileImg });
//     const savedMember = await this.memberRepository.save(member);
//     if (profileImg) {
//       savedMember['profile_img_url_thumbnail'] =
//         await this.filesService.getFileUrl(
//           profileImg.split('/').pop() ?? '',
//           'thumbnail',
//         );
//     }
//     return savedMember;
//   }

//   async deleteMember(userId: string, memberId: number): Promise<void> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const member = await this.memberRepository.findOne({
//       where: { id: memberId, company_id: company.id },
//     });
//     if (!member) throw new NotFoundException('Member not found');
//     await this.memberRepository.delete(memberId);
//   }

//   async addTechStack(
//     userId: string,
//     technologyId: number,
//   ): Promise<CompanyTechStack> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const technology = await this.technologyRepository.findOne({
//       where: { id: technologyId },
//     });
//     if (!technology) throw new NotFoundException('Technology not found');
//     const existingTechStack = await this.companyTechStackRepository.findOne({
//       where: { company_id: company.id, technology_id: technologyId },
//     });
//     if (existingTechStack)
//       throw new BadRequestException('Technology already in tech stack');
//     const techStack = this.companyTechStackRepository.create({
//       company_id: company.id,
//       technology_id: technologyId,
//       company,
//       technology,
//     });
//     return this.companyTechStackRepository.save(techStack);
//   }

//   async getTechStack(userId: string): Promise<Technology[]> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const techStacks = await this.companyTechStackRepository.find({
//       where: { company_id: company.id },
//       relations: ['technology'],
//     });
//     return techStacks.map((ts) => ts.technology);
//   }

//   async updateTechStack(
//     userId: string,
//     oldTechnologyId: number,
//     newTechnologyId: number,
//   ): Promise<CompanyTechStack> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const techStack = await this.companyTechStackRepository.findOne({
//       where: { company_id: company.id, technology_id: oldTechnologyId },
//       relations: ['technology'],
//     });
//     if (!techStack)
//       throw new NotFoundException('Old technology not found in tech stack');
//     const duplicate = await this.companyTechStackRepository.findOne({
//       where: { company_id: company.id, technology_id: newTechnologyId },
//     });
//     if (duplicate)
//       throw new BadRequestException(
//         'New technology already exists in tech stack',
//       );
//     const newTech = await this.technologyRepository.findOne({
//       where: { id: newTechnologyId },
//     });
//     if (!newTech) throw new NotFoundException('New technology not found');
//     techStack.technology_id = newTechnologyId;
//     techStack.technology = newTech;
//     return this.companyTechStackRepository.save(techStack);
//   }

//   async deleteTechStack(userId: string, technologyId: number): Promise<void> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const techStack = await this.companyTechStackRepository.findOne({
//       where: { company_id: company.id, technology_id: technologyId },
//     });
//     if (!techStack)
//       throw new NotFoundException('Technology not found in tech stack');
//     await this.companyTechStackRepository.delete({
//       company_id: company.id,
//       technology_id: technologyId,
//     });
//   }

//   async addOfficeLocation(
//     userId: string,
//     createOfficeLocationDto: CreateOfficeLocationDto,
//   ): Promise<OfficeLocation> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     if (createOfficeLocationDto.is_headquarters) {
//       await this.officeLocationRepository.update(
//         { company_id: company.id, is_headquarters: true },
//         { is_headquarters: false },
//       );
//     }
//     const location = this.officeLocationRepository.create({
//       company,
//       company_id: company.id,
//       ...createOfficeLocationDto,
//     });
//     return this.officeLocationRepository.save(location);
//   }

//   async getOfficeLocations(userId: string): Promise<OfficeLocation[]> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     return this.officeLocationRepository.find({
//       where: { company_id: company.id },
//       relations: ['images'],
//     });
//   }

//   async updateOfficeLocation(
//     userId: string,
//     locationId: number,
//     updateOfficeLocationDto: UpdateOfficeLocationDto,
//   ): Promise<OfficeLocation> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const location = await this.officeLocationRepository.findOne({
//       where: { id: locationId, company_id: company.id },
//     });
//     if (!location) throw new NotFoundException('Office location not found');
//     if (updateOfficeLocationDto.is_headquarters) {
//       await this.officeLocationRepository.update(
//         { company_id: company.id, is_headquarters: true },
//         { is_headquarters: false },
//       );
//     }
//     Object.assign(location, updateOfficeLocationDto);
//     return this.officeLocationRepository.save(location);
//   }

//   async deleteOfficeLocation(
//     userId: string,
//     locationId: number,
//   ): Promise<void> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const location = await this.officeLocationRepository.findOne({
//       where: { id: locationId, company_id: company.id },
//     });
//     if (!location) throw new NotFoundException('Office location not found');
//     await this.officeLocationRepository.delete(locationId);
//   }

//   async addOfficeImage(
//     userId: string,
//     locationId: number,
//     createOfficeImageDto: CreateOfficeImageDto,
//     file: Express.Multer.File,
//   ): Promise<OfficeImage> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const location = await this.officeLocationRepository.findOne({
//       where: { id: locationId, company_id: company.id },
//     });
//     if (!location) throw new NotFoundException('Office location not found');
//     if (
//       !['image/png', 'image/jpeg'].includes(file.mimetype) ||
//       file.size > 10 * 1024 * 1024
//     ) {
//       throw new BadRequestException(
//         'Invalid image format or size exceeds 10MB',
//       );
//     }
//     const uploadResult = await this.filesService.uploadFile(file);
//     const image = this.officeImageRepository.create({
//       officeLocation: location,
//       office_location_id: locationId,
//       image_url: uploadResult.originalPath,
//       ...createOfficeImageDto,
//     });
//     const savedImage = await this.officeImageRepository.save(image);
//     savedImage['image_url_thumbnail'] = await this.filesService.getFileUrl(
//       uploadResult.fileName,
//       'thumbnail',
//     );
//     return savedImage;
//   }

//   async getOfficeImages(
//     userId: string,
//     locationId: number,
//   ): Promise<OfficeImage[]> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const location = await this.officeLocationRepository.findOne({
//       where: { id: locationId, company_id: company.id },
//     });
//     if (!location) throw new NotFoundException('Office location not found');
//     const images = await this.officeImageRepository.find({
//       where: { office_location_id: locationId },
//     });
//     for (const image of images) {
//       image['image_url_thumbnail'] = await this.filesService.getFileUrl(
//         image.image_url.split('/').pop() ?? '',
//         'thumbnail',
//       );
//     }
//     return images;
//   }

//   async updateOfficeImage(
//     userId: string,
//     locationId: number,
//     imageId: number,
//     updateOfficeImageDto: UpdateOfficeImageDto,
//     file?: Express.Multer.File,
//   ): Promise<OfficeImage> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const image = await this.officeImageRepository.findOne({
//       where: { id: imageId, office_location_id: locationId },
//     });
//     if (!image) throw new NotFoundException('Office image not found');
//     if (
//       file &&
//       (!['image/png', 'image/jpeg'].includes(file.mimetype) ||
//         file.size > 10 * 1024 * 1024)
//     ) {
//       throw new BadRequestException(
//         'Invalid image format or size exceeds 10MB',
//       );
//     }
//     const imageUrl = file
//       ? (await this.filesService.uploadFile(file)).originalPath
//       : image.image_url;
//     Object.assign(image, { ...updateOfficeImageDto, image_url: imageUrl });
//     const savedImage = await this.officeImageRepository.save(image);
//     savedImage['image_url_thumbnail'] = await this.filesService.getFileUrl(
//       imageUrl.split('/').pop() ?? '',
//       'thumbnail',
//     );
//     return savedImage;
//   }

//   async deleteOfficeImage(
//     userId: string,
//     locationId: number,
//     imageId: number,
//   ): Promise<void> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const image = await this.officeImageRepository.findOne({
//       where: { id: imageId, office_location_id: locationId },
//     });
//     if (!image) throw new NotFoundException('Office image not found');
//     await this.officeImageRepository.delete(imageId);
//   }

//   async addCompanyDocument(
//     userId: string,
//     createCompanyDocumentDto: CreateCompanyDocumentDto,
//     file: Express.Multer.File,
//   ): Promise<CompanyDocument> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     if (
//       !['application/pdf', 'image/png', 'image/jpeg'].includes(file.mimetype) ||
//       file.size > 10 * 1024 * 1024
//     ) {
//       throw new BadRequestException(
//         'Invalid document format or size exceeds 10MB',
//       );
//     }
//     const uploadResult = await this.filesService.uploadFile(file);
//     const document = this.companyDocumentRepository.create({
//       company_id: company.id,
//       document_name: createCompanyDocumentDto.document_name,
//       document_url: uploadResult.originalPath,
//     });
//     const savedDocument = await this.companyDocumentRepository.save(document);
//     savedDocument['document_url_thumbnail'] =
//       await this.filesService.getFileUrl(uploadResult.fileName, 'thumbnail');
//     return savedDocument;
//   }

//   async getCompanyDocuments(userId: string): Promise<CompanyDocument[]> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const documents = await this.companyDocumentRepository.find({
//       where: { company_id: company.id },
//     });
//     for (const document of documents) {
//       document['document_url_thumbnail'] = await this.filesService.getFileUrl(
//         document.document_url.split('/').pop() ?? '',
//         'thumbnail',
//       );
//     }
//     return documents;
//   }

//   async updateCompanyDocument(
//     userId: string,
//     documentId: number,
//     updateCompanyDocumentDto: UpdateCompanyDocumentDto,
//     file?: Express.Multer.File,
//   ): Promise<CompanyDocument> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const document = await this.companyDocumentRepository.findOne({
//       where: { id: documentId, company_id: company.id },
//     });
//     if (!document) throw new NotFoundException('Document not found');
//     if (
//       file &&
//       (!['application/pdf', 'image/png', 'image/jpeg'].includes(
//         file.mimetype,
//       ) ||
//         file.size > 10 * 1024 * 1024)
//     ) {
//       throw new BadRequestException(
//         'Invalid document format or size exceeds 10MB',
//       );
//     }
//     const documentUrl = file
//       ? (await this.filesService.uploadFile(file)).originalPath
//       : document.document_url;
//     Object.assign(document, {
//       ...updateCompanyDocumentDto,
//       document_url: documentUrl,
//     });
//     const savedDocument = await this.companyDocumentRepository.save(document);
//     savedDocument['document_url_thumbnail'] =
//       await this.filesService.getFileUrl(
//         documentUrl.split('/').pop() ?? '',
//         'thumbnail',
//       );
//     return savedDocument;
//   }

//   async deleteCompanyDocument(
//     userId: string,
//     documentId: number,
//   ): Promise<void> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const document = await this.companyDocumentRepository.findOne({
//       where: { id: documentId, company_id: company.id },
//     });
//     if (!document) throw new NotFoundException('Document not found');
//     await this.companyDocumentRepository.delete(documentId);
//   }

//   async createJob(userId: string, createJobDto: CreateJobDto): Promise<Job> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const job = this.jobRepository.create({
//       company_id: company.id,
//       ...createJobDto,
//       created_by: company.user_id,
//     });
//     const savedJob = await this.jobRepository.save(job);
//     return this.jobhunterSystemService.enhanceJob(savedJob);
//   }

//   async updateJob(
//     userId: string,
//     jobId: number,
//     updateJobDto: UpdateJobDto,
//   ): Promise<Job> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const job = await this.jobRepository.findOne({
//       where: { id: jobId, company_id: company.id },
//     });
//     if (!job) throw new NotFoundException('Job not found');
//     Object.assign(job, updateJobDto);
//     const savedJob = await this.jobRepository.save(job);
//     return this.jobhunterSystemService.enhanceJob(savedJob);
//   }

//   async deleteJob(userId: string, jobId: number): Promise<void> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const job = await this.jobRepository.findOne({
//       where: { id: jobId, company_id: company.id },
//     });
//     if (!job) throw new NotFoundException('Job not found');
//     await this.jobRepository.delete(jobId);
//   }

//   async getJob(userId: string, jobId: number): Promise<Job> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const job = await this.jobRepository.findOne({
//       where: { id: jobId, company_id: company.id },
//       relations: ['company'],
//     });
//     if (!job) throw new NotFoundException('Job not found');
//     this.logger.log(`Fetching job: jobId=${jobId}, userId=${userId}`);
//     return this.jobhunterSystemService.enhanceJob(job);
//   }

//   async getAllJobs(
//     page: number = 1,
//     limit: number = 10,
//     industry?: string,
//   ): Promise<{ jobs: Job[]; total: number }> {
//     const query = this.jobRepository
//       .createQueryBuilder('job')
//       .leftJoinAndSelect('job.company', 'company')
//       .where('company.isActive = :isActive', { isActive: true });
//     if (industry) {
//       query.andWhere('company.industry LIKE :industry', {
//         industry: `%${industry}%`,
//       });
//     }
//     query.skip((page - 1) * limit).take(limit);
//     const [jobs, total] = await query.getManyAndCount();
//     const enhancedJobs = await this.jobhunterSystemService.enhanceJobs(jobs);
//     this.logger.log(
//       `Fetching all jobs: page=${page}, limit=${limit}, industry=${industry}`,
//     );
//     return { jobs: enhancedJobs, total };
//   }

//   async getJobs(
//     userId: number,
//     page: number,
//     limit: number,
//   ): Promise<{ jobs: Job[]; total: number }> {
//     if (isNaN(userId) || !Number.isInteger(userId)) {
//       throw new BadRequestException('Invalid user ID');
//     }
//     if (page < 1 || limit < 1) {
//       throw new BadRequestException('Invalid page or limit');
//     }
//     const company = await this.companyRepository.findOne({
//       where: { user_id: userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     this.logger.log(`Fetching jobs for company_id: ${company.id}`);
//     const [jobs, total] = await this.jobRepository.findAndCount({
//       where: { company_id: company.id },
//       relations: ['applications', 'company'],
//       skip: (page - 1) * limit,
//       take: limit,
//     });
//     const enhancedJobs = await this.jobhunterSystemService.enhanceJobs(jobs);
//     return { jobs: enhancedJobs, total };
//   }

//   async getJobApplications(
//     userId: string,
//     jobId: number,
//     status?: string,
//     page: number = 1,
//     limit: number = 10,
//   ): Promise<{ applications: JobApplication[]; total: number }> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const job = await this.jobRepository.findOne({
//       where: { id: jobId, company_id: company.id },
//     });
//     if (!job) throw new NotFoundException('Job not found');
//     const query = this.jobApplicationRepository
//       .createQueryBuilder('application')
//       .where('application.job_id = :jobId', { jobId })
//       .leftJoinAndSelect('application.user', 'user');
//     if (status) query.andWhere('application.status = :status', { status });
//     query.skip((page - 1) * limit).take(limit);
//     const [applications, total] = await query.getManyAndCount();
//     for (const application of applications) {
//       if (application.resume_url) {
//         application['resume_url_thumbnail'] =
//           await this.filesService.getFileUrl(
//             application.resume_url.split('/').pop() ?? '',
//             'thumbnail',
//           );
//       }
//     }
//     return { applications, total };
//   }

//   async updateApplicationStatus(
//     userId: string,
//     applicationId: number,
//     updateApplicationStatusDto: UpdateApplicationStatusDto,
//   ): Promise<JobApplication> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const application = await this.jobApplicationRepository.findOne({
//       where: { id: applicationId },
//       relations: ['job'],
//     });
//     if (!application || application.job.company_id !== company.id)
//       throw new NotFoundException('Application not found');
//     application.status = updateApplicationStatusDto.status;
//     const savedApplication =
//       await this.jobApplicationRepository.save(application);
//     if (savedApplication.resume_url) {
//       savedApplication['resume_url_thumbnail'] =
//         await this.filesService.getFileUrl(
//           savedApplication.resume_url.split('/').pop() ?? '',
//           'thumbnail',
//         );
//     }
//     await this.notificationRepository.save({
//       user_id: savedApplication.user_id,
//       title: `Application Status Updated`,
//       message: `Your application for ${application.job.title} has been ${updateApplicationStatusDto.status}.`,
//     });
//     return savedApplication;
//   }

//   async scheduleInterview(
//     userId: string,
//     applicationId: number,
//     scheduleInterviewDto: ScheduleInterviewDto,
//   ): Promise<Interview> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const application = await this.jobApplicationRepository.findOne({
//       where: { id: applicationId },
//       relations: ['job'],
//     });
//     if (!application || application.job.company_id !== company.id)
//       throw new NotFoundException('Application not found');
//     const interview = this.interviewRepository.create({
//       jobApplication: application,
//       job_application_id: applicationId,
//       ...scheduleInterviewDto,
//     });
//     const savedInterview = await this.interviewRepository.save(interview);
//     await this.notificationRepository.save({
//       user_id: application.user_id,
//       title: `Interview Scheduled`,
//       message: `An interview for ${application.job.title} has been scheduled on ${scheduleInterviewDto.schedule_at}.`,
//     });
//     return savedInterview;
//   }

//   async getInterviews(
//     userId: string,
//     jobId?: number,
//     status?: string,
//     page: number = 1,
//     limit: number = 10,
//   ): Promise<{ interviews: Interview[]; total: number }> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const query = this.interviewRepository
//       .createQueryBuilder('interview')
//       .leftJoinAndSelect('interview.jobApplication', 'jobApplication')
//       .leftJoinAndSelect('jobApplication.job', 'job')
//       .where('job.company_id = :companyId', { companyId: company.id });
//     if (jobId) query.andWhere('job.id = :jobId', { jobId });
//     if (status) query.andWhere('interview.status = :status', { status });
//     query.skip((page - 1) * limit).take(limit);
//     const [interviews, total] = await query.getManyAndCount();
//     return { interviews, total };
//   }

//   async updateInterviewStatus(
//     userId: string,
//     interviewId: number,
//     status: string,
//   ): Promise<Interview> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const interview = await this.interviewRepository.findOne({
//       where: { id: interviewId },
//       relations: ['jobApplication', 'jobApplication.job'],
//     });
//     if (!interview || interview.jobApplication.job.company_id !== company.id)
//       throw new NotFoundException('Interview not found');
//     interview.status = status;
//     const savedInterview = await this.interviewRepository.save(interview);
//     await this.notificationRepository.save({
//       user_id: interview.jobApplication.user_id,
//       title: `Interview Status Updated`,
//       message: `Your interview for ${interview.jobApplication.job.title} is now ${status}.`,
//     });
//     return savedInterview;
//   }

//   async sendNotification(
//     userId: string,
//     sendNotificationDto: SendNotificationDto,
//   ): Promise<Notification> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const notification = this.notificationRepository.create({
//       user_id: sendNotificationDto.user_id,
//       title: sendNotificationDto.title,
//       message: sendNotificationDto.message,
//     });
//     return this.notificationRepository.save(notification);
//   }

//   async getAnalytics(userId: string, jobId?: number): Promise<any> {
//     const company = await this.companyRepository.findOne({
//       where: { user_id: +userId },
//     });
//     if (!company) throw new NotFoundException('Company not found');
//     const query = this.jobRepository
//       .createQueryBuilder('job')
//       .leftJoinAndSelect('job.applications', 'applications')
//       .where('job.company_id = :companyId', { companyId: company.id });
//     if (jobId) query.andWhere('job.id = :jobId', { jobId });
//     const jobs = await query.getMany();
//     const analytics = {
//       totalJobs: jobs.length,
//       totalApplications: jobs.reduce(
//         (sum, job) => sum + job.applications.length,
//         0,
//       ),
//       totalViews: jobs.reduce((sum, job) => sum + job.views, 0),
//       hiringTrends: jobs.map((job) => ({
//         jobId: job.id,
//         title: job.title,
//         applications: job.applications.length,
//         views: job.views,
//         posted_at: job.posted_at,
//       })),
//     };
//     this.logger.log(`Analytics fetched for userId: ${userId}, jobId: ${jobId}`);
//     return analytics;
//   }
// }
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Company } from './entities/company.entity';
import { Member } from './entities/member.entity';
import { Technology } from './technology/technology.entity';
import { CompanyTechStack } from './entities/company-tech-stack.entity';
import { OfficeLocation } from './entities/office-location.entity';
import { OfficeImage } from './entities/office-image.entity';
import { CompanyDocument } from './entities/company-document.entity';
import { Job } from './entities/job.entity';
import { JobApplication } from './entities/job-application.entity';
import { Interview } from './entities/interview.entity';
import { Notification } from './entities/notification.entity';
import { FilesService } from '../files/files.service';
import { JobhunterSystemService } from '../jobhunter-system/jobhunter-system.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateOfficeLocationDto } from './dto/create-office-location.dto';
import { UpdateOfficeLocationDto } from './dto/update-office-location.dto';
import { CreateOfficeImageDto } from './dto/create-office-image.dto';
import { UpdateOfficeImageDto } from './dto/update-office-image.dto';
import { CreateCompanyDocumentDto } from './dto/create-document.dto';
import { UpdateCompanyDocumentDto } from './dto/update-document.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { CompanyResponseDto } from './dto/company-response.dto';

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
    private jobhunterSystemService: JobhunterSystemService,
  ) {}

  private readonly logger = new Logger(CompaniesService.name);

  async createCompany(
    userId: string,
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    const existingCompany = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (existingCompany)
      throw new BadRequestException('User already has a company');
    const company = this.companyRepository.create({
      ...createCompanyDto,
    });
    const savedCompany = await this.companyRepository.save(company);
    return this.jobhunterSystemService.enhanceCompany(savedCompany);
  }

  async updateCompany(
    userId: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    Object.assign(company, updateCompanyDto);
    const savedCompany = await this.companyRepository.save(company);
    return this.jobhunterSystemService.enhanceCompany(savedCompany);
  }

  async uploadCompanyMedia(
    userId: string,
    file: Express.Multer.File,
    type: 'logo' | 'image',
  ): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
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
    }
    const savedCompany = await this.companyRepository.save(company);
    return this.jobhunterSystemService.enhanceCompany(savedCompany);
  }

  async getCompany(userId: string): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { user_id: parseInt(userId), isActive: true },
      relations: [
        'members',
        'officeLocations',
        'officeLocations.images',
        'documents',
        'jobs',
        'techStacks',
        'techStacks.technology',
      ],
    });
    if (!company) throw new NotFoundException('Company not found or inactive');
    this.logger.log(`Fetching company for userId: ${userId}`);
    return this.jobhunterSystemService.enhanceCompany(company);
  }

  async getCompanies(
    page: number = 1,
    limit: number = 10,
    industry?: string,
  ): Promise<{
    companies: CompanyResponseDto[];
    total: number;
  }> {
    const query = this.companyRepository
      .createQueryBuilder('company')
      .where('company.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('company.members', 'members')
      .leftJoinAndSelect('company.techStacks', 'techStacks')
      .leftJoinAndSelect('techStacks.technology', 'technology')
      .leftJoinAndSelect('company.officeLocations', 'officeLocations')
      .leftJoinAndSelect('officeLocations.images', 'images')
      .leftJoinAndSelect('company.documents', 'documents')
      .leftJoinAndSelect('company.jobs', 'jobs');
    if (industry)
      query.andWhere('company.industry LIKE :industry', {
        industry: `%${industry}%`,
      });
    query.skip((page - 1) * limit).take(limit);
    const [companies, total] = await query.getManyAndCount();
    this.logger.log(
      `Fetching companies: page=${page}, limit=${limit}, industry=${industry}`,
    );
    const enhancedCompanies = await Promise.all(
      companies.map((company) =>
        this.jobhunterSystemService.enhanceCompany(company),
      ),
    );
    return { companies: enhancedCompanies, total };
  }

  async deleteCompany(userId: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    await this.companyRepository.update(
      { user_id: +userId },
      { isActive: false },
    );
  }

  async addMember(
    userId: string,
    createMemberDto: CreateMemberDto,
    file?: Express.Multer.File,
  ): Promise<Member> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
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
      where: { user_id: parseInt(userId) },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const member = await this.memberRepository.findOne({
      where: { id: memberId, company_id: company.id },
    });
    if (!member) throw new NotFoundException('Member not found');
    await this.memberRepository.delete(memberId);
  }

  async addTechStack(
    userId: string,
    technologyId: number,
  ): Promise<CompanyTechStack> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const technology = await this.technologyRepository.findOne({
      where: { id: technologyId },
    });
    if (!technology) throw new NotFoundException('Technology not found');
    const existingTechStack = await this.companyTechStackRepository.findOne({
      where: { company_id: company.id, technology_id: technologyId },
    });
    if (existingTechStack)
      throw new BadRequestException('Technology already in tech stack');
    const techStack = this.companyTechStackRepository.create({
      company_id: company.id,
      technology_id: technologyId,
      company,
      technology,
    });
    return this.companyTechStackRepository.save(techStack);
  }

  async getTechStack(userId: string): Promise<Technology[]> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const techStacks = await this.companyTechStackRepository.find({
      where: { company_id: company.id },
      relations: ['technology'],
    });
    return techStacks.map((ts) => ts.technology);
  }

  async updateTechStack(
    userId: string,
    oldTechnologyId: number,
    newTechnologyId: number,
  ): Promise<CompanyTechStack> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const techStack = await this.companyTechStackRepository.findOne({
      where: { company_id: company.id, technology_id: oldTechnologyId },
      relations: ['technology'],
    });
    if (!techStack)
      throw new NotFoundException('Old technology not found in tech stack');
    const duplicate = await this.companyTechStackRepository.findOne({
      where: { company_id: company.id, technology_id: newTechnologyId },
    });
    if (duplicate)
      throw new BadRequestException(
        'New technology already exists in tech stack',
      );
    const newTech = await this.technologyRepository.findOne({
      where: { id: newTechnologyId },
    });
    if (!newTech) throw new NotFoundException('New technology not found');
    techStack.technology_id = newTechnologyId;
    techStack.technology = newTech;
    return this.companyTechStackRepository.save(techStack);
  }

  async deleteTechStack(userId: string, technologyId: number): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const techStack = await this.companyTechStackRepository.findOne({
      where: { company_id: company.id, technology_id: technologyId },
    });
    if (!techStack)
      throw new NotFoundException('Technology not found in tech stack');
    await this.companyTechStackRepository.delete({
      company_id: company.id,
      technology_id: technologyId,
    });
  }

  async addOfficeLocation(
    userId: string,
    createOfficeLocationDto: CreateOfficeLocationDto,
  ): Promise<OfficeLocation> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const image = await this.officeImageRepository.findOne({
      where: { id: imageId, office_location_id: locationId },
    });
    if (!image) throw new NotFoundException('Office image not found');
    await this.officeImageRepository.delete(imageId);
  }

  async addCompanyDocument(
    userId: string,
    createCompanyDocumentDto: CreateCompanyDocumentDto,
    file: Express.Multer.File,
  ): Promise<CompanyDocument> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const job = this.jobRepository.create({
      company_id: company.id,
      company,
      ...createJobDto,
      created_by: company.user_id,
    });
    const savedJob = await this.jobRepository.save(job);
    return this.jobhunterSystemService.enhanceJob(savedJob);
  }

  async updateJob(
    userId: string,
    jobId: number,
    updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const job = await this.jobRepository.findOne({
      where: { id: jobId, company_id: company.id },
      relations: ['company', 'applications'],
    });
    if (!job) throw new NotFoundException('Job not found');
    Object.assign(job, updateJobDto);
    const savedJob = await this.jobRepository.save(job);
    return this.jobhunterSystemService.enhanceJob(savedJob);
  }

  async deleteJob(userId: string, jobId: number): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const job = await this.jobRepository.findOne({
      where: { id: jobId, company_id: company.id },
    });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobRepository.delete(jobId);
  }

  async getJob(userId: string, jobId: number): Promise<Job> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const job = await this.jobRepository.findOne({
      where: { id: jobId, company_id: company.id },
      relations: ['company', 'applications'],
    });
    if (!job) throw new NotFoundException('Job not found');
    this.logger.log(`Fetching job: jobId=${jobId}, userId=${userId}`);
    return this.jobhunterSystemService.enhanceJob(job);
  }

  async getAllJobs(
    page: number = 1,
    limit: number = 10,
    industry?: string,
  ): Promise<{ jobs: Job[]; total: number }> {
    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.applications', 'applications')
      .where('company.isActive = :isActive', { isActive: true });
    if (industry) {
      query.andWhere('company.industry LIKE :industry', {
        industry: `%${industry}%`,
      });
    }
    query.skip((page - 1) * limit).take(limit);
    const [jobs, total] = await query.getManyAndCount();
    const enhancedJobs = await this.jobhunterSystemService.enhanceJobs(jobs);
    this.logger.log(
      `Fetching all jobs: page=${page}, limit=${limit}, industry=${industry}`,
    );
    return { jobs: enhancedJobs, total };
  }

  async getJobs(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ jobs: Job[]; total: number }> {
    if (isNaN(userId) || !Number.isInteger(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Invalid page or limit');
    }
    const company = await this.companyRepository.findOne({
      where: { user_id: userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    this.logger.log(`Fetching jobs for company_id: ${company.id}`);
    const [jobs, total] = await this.jobRepository.findAndCount({
      where: { company_id: company.id },
      relations: ['company', 'applications'],
      skip: (page - 1) * limit,
      take: limit,
    });
    const enhancedJobs = await this.jobhunterSystemService.enhanceJobs(jobs);
    return { jobs: enhancedJobs, total };
  }

  async getJobApplications(
    userId: string,
    jobId: number,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ applications: JobApplication[]; total: number }> {
    const company = await this.companyRepository.findOne({
      where: { user_id: +userId },
    });
    if (!company) throw new NotFoundException('Company not found');
    const job = await this.jobRepository.findOne({
      where: { id: jobId, company_id: company.id },
    });
    if (!job) throw new NotFoundException('Job not found');
    const query = this.jobApplicationRepository
      .createQueryBuilder('application')
      .where('application.job_id = :jobId', { jobId })
      .leftJoinAndSelect('application.job', 'job');
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
      if (application.job?.company?.brand_logo) {
        application.job['companyLogo'] = await this.filesService.getFileUrl(
          application.job.company.brand_logo.split('/').pop() ?? '',
          'original',
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
      where: { user_id: +userId },
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
    this.logger.log(`Analytics fetched for userId: ${userId}, jobId: ${jobId}`);
    return analytics;
  }
}
