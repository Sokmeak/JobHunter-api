import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Job } from '../companies/entities/job.entity';
import { Company } from '../companies/entities/company.entity';
import { FilesService } from '../files/files.service'; // Assuming FilesService exists for thumbnail generation

@Injectable()
export class JobhunterSystemService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly filesService: FilesService, // Inject FilesService for thumbnail generation
  ) {}

  async getAllCompanies(
    page: number = 1,
    limit: number = 30,
    searchkeyparam?: string,
    location?: string,
  ): Promise<{
    companies: Array<
      Company & {
        officeImages: Array<{
          id: number;
          image_url: string;
          thumbnail_url: string;
          caption?: string;
        }>;
        technologies: any[];
        brand_logo_thumbnail: string;
      }
    >;
    total: number;
  }> {
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    const query = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.officeLocations', 'officeLocations')
      .leftJoinAndSelect('officeLocations.images', 'officeImages')
      .leftJoinAndSelect('company.members', 'members')
      .leftJoinAndSelect('company.documents', 'documents')
      .leftJoinAndSelect('company.jobs', 'jobs')
      .leftJoinAndSelect('company.techStacks', 'techStacks')
      .where('company.isActive = :isActive', { isActive: true });

    if (searchkeyparam || location) {
      query.andWhere(
        new Brackets((qb) => {
          if (searchkeyparam) {
            qb.where(
              '(company.name ILIKE :search OR company.culture_description ILIKE :search OR company.tags && :searchTags::varchar[])',
              {
                search: `%${searchkeyparam}%`,
                searchTags: `{${searchkeyparam}}`,
              },
            );
          }
          if (location) {
            qb.andWhere('company.headquarters_location ILIKE :location', {
              location: `%${location}%`,
            });
          }
        }),
      );
    }

    query.skip((page - 1) * limit).take(limit);

    const [companies, total] = await query.getManyAndCount();

    // Process office images and thumbnails for each company
    const enhancedCompanies = await Promise.all(
      companies.map(async (company) => {
        // Aggregate office images
        const officeImages = (company.officeLocations ?? []).flatMap(
          (location) =>
            (location.images ?? []).map((image) => ({
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

        // Generate thumbnail for brand_logo
        let brand_logo_thumbnail = '';
        if (company.brand_logo) {
          brand_logo_thumbnail = await this.filesService.getFileUrl(
            company.brand_logo.split('/').pop() ?? '',
            'thumbnail',
          );
        }

        // Generate thumbnails for documents
        for (const document of company.documents) {
          document['document_url_thumbnail'] =
            await this.filesService.getFileUrl(
              document.document_url.split('/').pop() ?? '',
              'thumbnail',
            );
        }

        // Map technologies from techStacks
        const technologies = company.techStacks.map((techStack) => ({
          id: techStack.id,
          technology: techStack.technology, // Assuming techStack has a technology relation or field
        }));

        return {
          ...company,
          officeImages: officeImages,
          technologies,
          brand_logo_thumbnail,
        };
      }),
    );

    return {
      companies: enhancedCompanies as Array<
        Company & {
          officeImages: Array<{
            id: number;
            image_url: string;
            thumbnail_url: string;
            caption?: string;
          }>;
          technologies: any[];
          brand_logo_thumbnail: string;
        }
      >,
      total,
    };
  }

  async getAllJobs(
    page: number = 1,
    limit: number = 30,
    searchkeyparam?: string,
    location?: string,
  ): Promise<{ jobs: Job[]; total: number }> {
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('company.officeLocations', 'officeLocations')
      .leftJoinAndSelect('officeLocations.images', 'officeImages')
      .leftJoinAndSelect('company.techStacks', 'techStacks')
      .where('job.is_visible = :isVisible', { isVisible: true })
      .andWhere('company.isActive = :isActive', { isActive: true });

    if (searchkeyparam || location) {
      query.andWhere(
        new Brackets((qb) => {
          if (searchkeyparam) {
            qb.where(
              '(job.title ILIKE :search OR job.description ILIKE :search OR company.name ILIKE :search OR company.tags && :searchTags::varchar[])',
              {
                search: `%${searchkeyparam}%`,
                searchTags: `{${searchkeyparam}}`,
              },
            );
          }
          if (location) {
            qb.andWhere(
              '(job.location ILIKE :location OR company.headquarters_location ILIKE :location)',
              { location: `%${location}%` },
            );
          }
        }),
      );
    }

    query.skip((page - 1) * limit).take(limit);

    const [jobs, total] = await query.getManyAndCount();

    // Process thumbnails for company brand_logo
    for (const job of jobs) {
      if (job.company?.brand_logo) {
        job.company['brand_logo_thumbnail'] =
          await this.filesService.getFileUrl(
            job.company.brand_logo.split('/').pop() ?? '',
            'thumbnail',
          );
      }
    }

    return { jobs, total };
  }

  // async getCompanyById(id: number): Promise<
  //   Company & {
  //     officeImages: Array<{
  //       id: number;
  //       image_url: string;
  //       thumbnail_url: string;
  //       caption?: string;
  //     }>;
  //     technologies: any[];
  //   }
  // > {
   async getCompanyById(id: number): Promise<void> {
    if (id < 1) throw new BadRequestException('Invalid company ID');

    const company = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.officeLocations', 'officeLocations')
      .leftJoinAndSelect('officeLocations.images', 'officeImages')
      .leftJoinAndSelect('company.members', 'members')
      .leftJoinAndSelect('company.documents', 'documents')
      .leftJoinAndSelect('company.jobs', 'jobs')
      .leftJoinAndSelect('company.techStacks', 'techStacks')
      .where('company.id = :id', { id })
      .andWhere('company.isActive = :isActive', { isActive: true })
      .getOne();

    if (!company) {
      throw new NotFoundException(
        `Company with ID ${id} not found or inactive`,
      );
    }

    // Aggregate office images
    const officeImages = (company.officeLocations ?? []).flatMap((location) =>
      (location.images ?? []).map((image) => ({
        id: image.id,
        image_url: image.image_url,
        thumbnail_url: '',
        caption: image.caption,
      })),
    );

    // // Generate thumbnails for office images
    for (const officeImage of officeImages) {
      officeImage.thumbnail_url = await this.filesService.getFileUrl(
        officeImage.image_url.split('/').pop() ?? '',
        'thumbnail',
      );
    }

    // Generate thumbnail for brand_logo
    let brand_logo_thumbnail = '';
    if (company.brand_logo) {
      brand_logo_thumbnail = await this.filesService.getFileUrl(
        company.brand_logo.split('/').pop() ?? '',
        'thumbnail',
      );
    }

    // Generate thumbnails for documents
    for (const document of company.documents) {
      document['document_url_thumbnail'] = await this.filesService.getFileUrl(
        document.document_url.split('/').pop() ?? '',
        'thumbnail',
      );
    }

    // Map technologies from techStacks
    const technologies = company.techStacks.map((techStack) => ({
      id: techStack.id,
      technology: techStack.technology,
    }));

    // return {
    //   ...company,
    //   officeImages: officeImages, // This is a new property for the response, not the entity property
    //   technologies,
    //   brand_logo_thumbnail,
    // };
  }

  async getJobById(id: number): Promise<Job> {
    if (id < 1) throw new BadRequestException('Invalid job ID');

    const job = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('company.officeLocations', 'officeLocations')
      .leftJoinAndSelect('officeLocations.images', 'officeImages')
      .leftJoinAndSelect('company.techStacks', 'techStacks')
      .where('job.id = :id', { id })
      .andWhere('job.is_visible = :isVisible', { isVisible: true })
      .andWhere('company.isActive = :isActive', { isActive: true })
      .getOne();

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found or not visible`);
    }

    // Generate thumbnail for company brand_logo
    if (job.company?.brand_logo) {
      job.company['brand_logo_thumbnail'] = await this.filesService.getFileUrl(
        job.company.brand_logo.split('/').pop() ?? '',
        'thumbnail',
      );
    }

    return job;
  }

  async getSimilarJobs(
    jobId: number,
    limit: number = 5,
  ): Promise<{ jobs: Job[]; total: number }> {
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    const job = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .where('job.id = :id', { id: jobId })
      .andWhere('job.is_visible = :isVisible', { isVisible: true })
      .getOne();

    if (!job) {
      throw new NotFoundException(
        `Job with ID ${jobId} not found or not visible`,
      );
    }

    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('company.officeLocations', 'officeLocations')
      .leftJoinAndSelect('officeLocations.images', 'officeImages')
      .leftJoinAndSelect('company.techStacks', 'techStacks')
      .where('job.is_visible = :isVisible', { isVisible: true })
      .andWhere('job.id != :jobId', { jobId })
      .andWhere('company.isActive = :isActive', { isActive: true });

    query.andWhere(
      new Brackets((qb) => {
        qb.where('job.title ILIKE :title', { title: `%${job.title}%` })
          .orWhere('job.description ILIKE :description', {
            description: `%${job.description}%`,
          })
          .orWhere('job.company = :companyId', { companyId: job.company.id })
          .orWhere('company.industry = :industry', {
            industry: job.company.industry,
          })
          .orWhere('company.tags && :jobTags::varchar[]', {
            jobTags: job.company.tags || [],
          });
      }),
    );

    query.take(limit);

    const [jobs, total] = await query.getManyAndCount();

    // Process thumbnails for company brand_logo
    for (const job of jobs) {
      if (job.company?.brand_logo) {
        job.company['brand_logo_thumbnail'] =
          await this.filesService.getFileUrl(
            job.company.brand_logo.split('/').pop() ?? '',
            'thumbnail',
          );
      }
    }

    return { jobs, total };
  }

  async getSimilarCompanies(
    companyId: number,
    limit: number = 5,
  ): Promise<{
    companies: Array<
      Company & {
        officeImages: Array<{
          id: number;
          image_url: string;
          thumbnail_url: string;
          caption?: string;
        }>;
        technologies: any[];
      }
    >;
    total: number;
  }> {
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    const company = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.techStacks', 'techStacks')
      .where('company.id = :id', { id: companyId })
      .andWhere('company.isActive = :isActive', { isActive: true })
      .getOne();

    if (!company) {
      throw new NotFoundException(
        `Company with ID ${companyId} not found or inactive`,
      );
    }

    const query = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.officeLocations', 'officeLocations')
      .leftJoinAndSelect('officeLocations.images', 'officeImages')
      .leftJoinAndSelect('company.members', 'members')
      .leftJoinAndSelect('company.documents', 'documents')
      .leftJoinAndSelect('company.jobs', 'jobs')
      .leftJoinAndSelect('company.techStacks', 'techStacks')
      .where('company.id != :companyId', { companyId })
      .andWhere('company.isActive = :isActive', { isActive: true });

    query.andWhere(
      new Brackets((qb) => {
        qb.where('company.name ILIKE :name', { name: `%${company.name}%` })
          .orWhere('company.culture_description ILIKE :culture', {
            culture: `%${company.culture_description}%`,
          })
          .orWhere('company.industry = :industry', {
            industry: company.industry,
          })
          .orWhere('company.tags && :companyTags::varchar[]', {
            companyTags: company.tags || [],
          });
      }),
    );

    query.take(limit);

    const [companies, total] = await query.getManyAndCount();

    // Process office images and thumbnails for each company
    const enhancedCompanies = await Promise.all(
      companies.map(async (comp) => {
        // Aggregate office images
        const officeImages = comp.officeLocations.flatMap((location) =>
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

        // Generate thumbnail for brand_logo
        let brand_logo_thumbnail = '';
        if (comp.brand_logo) {
          brand_logo_thumbnail = await this.filesService.getFileUrl(
            comp.brand_logo.split('/').pop() ?? '',
            'thumbnail',
          );
        }

        // Generate thumbnails for documents
        for (const document of comp.documents) {
          document['document_url_thumbnail'] =
            await this.filesService.getFileUrl(
              document.document_url.split('/').pop() ?? '',
              'thumbnail',
            );
        }

        // Map technologies from techStacks
        const technologies = comp.techStacks.map((techStack) => ({
          id: techStack.id,
          technology: techStack.technology,
        }));

        return {
          ...comp,
          officeImages,
          technologies,
          brand_logo_thumbnail,
        };
      }),
    );

    return {
      companies: enhancedCompanies as Array<
        Company & {
          officeImages: Array<{
            id: number;
            image_url: string;
            thumbnail_url: string;
            caption?: string;
          }>;
          technologies: any[];
          brand_logo_thumbnail: string;
        }
      >,
      total,
    };
  }
}
