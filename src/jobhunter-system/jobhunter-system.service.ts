import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Job } from '../companies/entities/job.entity';
import { Company } from '../companies/entities/company.entity';
import { FilesService } from '../files/files.service';


import {
  CompanyResponseDto,
  EnhancedOfficeImage,
  EnhancedTechnology,
} from 'src/companies/dto/company-response.dto';

@Injectable()
export class JobhunterSystemService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly filesService: FilesService,
  ) {}
  public async enhanceCompany(company: Company): Promise<CompanyResponseDto> {
    const officeImages: EnhancedOfficeImage[] = (
      company.officeLocations ?? []
    ).flatMap((location) =>
      (location.images ?? []).map((image) => ({
        id: image.id,
        image_url: image.image_url,
        thumbnail_url: '',
        caption: image.caption,
      })),
    );

    await Promise.all(
      officeImages.map(async (officeImage) => {
        if (!officeImage.image_url) {
          officeImage.thumbnail_url = '';
          return;
        }
        try {
          officeImage.thumbnail_url = await this.filesService.getFileUrl(
            officeImage.image_url.split('/').pop() ?? '',
            'thumbnail',
          );
        } catch (error) {
          console.error(
            `Failed to generate thumbnail for image ${officeImage.image_url}:`,
            error,
          );
          officeImage.thumbnail_url = '';
        }
      }),
    );

    let brand_logo_thumbnail = '';
    if (company.brand_logo) {
      try {
        brand_logo_thumbnail = await this.filesService.getFileUrl(
          company.brand_logo.split('/').pop() ?? '',
          'thumbnail',
        );
      } catch (error) {
        console.error(
          `Failed to generate thumbnail for brand logo ${company.brand_logo}:`,
          error,
        );
      }
    }

    await Promise.all(
      (company.documents ?? []).map(async (document) => {
        if (!document.document_url) {
          document['document_url_thumbnail'] = '';
          return;
        }
        try {
          document['document_url_thumbnail'] =
            await this.filesService.getFileUrl(
              document.document_url.split('/').pop() ?? '',
              'thumbnail',
            );
        } catch (error) {
          console.error(
            `Failed to generate thumbnail for document ${document.document_url}:`,
            error,
          );
          document['document_url_thumbnail'] = '';
        }
      }),
    );

    const technologies: EnhancedTechnology[] = (company.techStacks ?? []).map(
      (techStack) => ({
        id: techStack.id,
        technology: techStack.technology,
      }),
    );

    return new CompanyResponseDto(
      company,
      officeImages,
      technologies,
      brand_logo_thumbnail,
    );
  }
  // Helper method to enhance a job with company brand_logo thumbnail
  public async enhanceJob(job: Job): Promise<Job> {
    if (job.company?.brand_logo) {
      try {
        job.company['brand_logo_thumbnail'] =
          await this.filesService.getFileUrl(
            job.company.brand_logo.split('/').pop() ?? '',
            'thumbnail',
          );
      } catch (error) {
        console.error(
          `Failed to generate thumbnail for brand logo ${job.company.brand_logo}:`,
          error,
        );
        job.company['brand_logo_thumbnail'] = '';
      }
    }
    return job;
  }

  // Helper method to enhance multiple jobs
  public  async enhanceJobs(jobs: Job[]): Promise<Job[]> {
    return Promise.all(jobs.map((job) => this.enhanceJob(job)));
  }

  async getAllCompanies(
    page: number = 1,
    limit: number = 30,
    searchkeyparam?: string,
    location?: string,
  ): Promise<{
    companies: CompanyResponseDto[];
    total: number;
  }> {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new BadRequestException('Page must be a positive integer');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('Limit must be a positive integer');
      }

      const query = this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.officeLocations', 'officeLocations')
        .leftJoinAndSelect('officeLocations.images', 'officeImages')
        .leftJoinAndSelect('company.members', 'members')
        .leftJoinAndSelect('company.documents', 'documents')
        .leftJoinAndSelect('company.jobs', 'jobs')
        .leftJoinAndSelect('company.techStacks', 'techStacks')
        .leftJoinAndSelect('techStacks.technology', 'technology') // Join Technology relation
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

      // Enhance companies in parallel
      const enhancedCompanies = await Promise.all(
        companies.map((company) => this.enhanceCompany(company)),
      );

      return { companies: enhancedCompanies, total };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve companies');
    }
  }

  async getAllJobs(
    page: number = 1,
    limit: number = 30,
    searchkeyparam?: string,
    location?: string,
  ): Promise<{ jobs: Job[]; total: number }> {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new BadRequestException('Page must be a positive integer');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('Limit must be a positive integer');
      }

      const query = this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .leftJoinAndSelect('company.officeLocations', 'officeLocations')
        .leftJoinAndSelect('officeLocations.images', 'officeImages')
        .leftJoinAndSelect('company.techStacks', 'techStacks')
        .leftJoinAndSelect('techStacks.technology', 'technology') // Join Technology relation
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

      // Enhance jobs with thumbnails
      const enhancedJobs = await this.enhanceJobs(jobs);

      return { jobs: enhancedJobs, total };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve jobs');
    }
  }

  async getCompanyById(id: number): Promise<CompanyResponseDto> {
    try {
      if (!Number.isInteger(id) || id < 1) {
        throw new BadRequestException('Invalid company ID');
      }

      const company = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.officeLocations', 'officeLocations')
        .leftJoinAndSelect('officeLocations.images', 'officeImages')
        .leftJoinAndSelect('company.members', 'members')
        .leftJoinAndSelect('company.documents', 'documents')
        .leftJoinAndSelect('company.jobs', 'jobs')
        .leftJoinAndSelect('company.techStacks', 'techStacks')
        .leftJoinAndSelect('techStacks.technology', 'technology') // Join Technology relation
        .where('company.id = :id', { id })
        .andWhere('company.isActive = :isActive', { isActive: true })
        .getOne();

      if (!company) {
        throw new NotFoundException(
          `Company with ID ${id} not found or inactive`,
        );
      }

      return await this.enhanceCompany(company);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve company');
    }
  }

  async getJobById(id: number): Promise<Job> {
    try {
      if (!Number.isInteger(id) || id < 1) {
        throw new BadRequestException('Invalid job ID');
      }

      const job = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .leftJoinAndSelect('company.officeLocations', 'officeLocations')
        .leftJoinAndSelect('officeLocations.images', 'officeImages')
        .leftJoinAndSelect('company.techStacks', 'techStacks')
        .leftJoinAndSelect('techStacks.technology', 'technology') // Join Technology relation
        .where('job.id = :id', { id })
        .andWhere('job.is_visible = :isVisible', { isVisible: true })
        .andWhere('company.isActive = :isActive', { isActive: true })
        .getOne();

      if (!job) {
        throw new NotFoundException(
          `Job with ID ${id} not found or not visible`,
        );
      }

      return await this.enhanceJob(job);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve job');
    }
  }

  async getSimilarJobs(
    jobId: number,
    limit: number = 5,
  ): Promise<{ jobs: Job[]; total: number }> {
    try {
      if (!Number.isInteger(jobId) || jobId < 1) {
        throw new BadRequestException('Invalid job ID');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('Limit must be a positive integer');
      }

      const job = await this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .leftJoinAndSelect('company.techStacks', 'techStacks')
        .leftJoinAndSelect('techStacks.technology', 'technology') // Join Technology relation
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
        .leftJoinAndSelect('techStacks.technology', 'technology') // Join Technology relation
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

      // Enhance jobs with thumbnails
      const enhancedJobs = await this.enhanceJobs(jobs);

      return { jobs: enhancedJobs, total };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve similar jobs');
    }
  }

  async getSimilarCompanies(
    companyId: number,
    limit: number = 5,
  ): Promise<{
    companies: CompanyResponseDto[];
    total: number;
  }> {
    try {
      if (!Number.isInteger(companyId) || companyId < 1) {
        throw new BadRequestException('Invalid company ID');
      }
      if (!Number.isInteger(limit) || limit < 1) {
        throw new BadRequestException('Limit must be a positive integer');
      }

      const company = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.techStacks', 'techStacks')
        .leftJoinAndSelect('techStacks.technology', 'technology') // Join Technology relation
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
        .leftJoinAndSelect('techStacks.technology', 'technology') // Join Technology relation
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

      // Enhance companies in parallel
      const enhancedCompanies = await Promise.all(
        companies.map((comp) => this.enhanceCompany(comp)),
      );

      return { companies: enhancedCompanies, total };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve similar companies');
    }
  }
}
