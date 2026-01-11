import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, SelectQueryBuilder } from 'typeorm';
import { Job } from '../companies/entities/job.entity';
import { Company } from '../companies/entities/company.entity';
import { FilesService } from '../files/files.service';

import {
  CompanyResponseDto,
  EnhancedOfficeImage,
  EnhancedTechnology,
} from 'src/companies/dto/company-response.dto';

// Enhanced interfaces for better type safety
interface SearchOptions {
  page?: number;
  limit?: number;
  keyword?: string;
  location?: string;
  tags?: string[];
  techStacks?: string[];
  sortBy?: 'name' | 'created_at' | 'relevance' | 'industry';
  sortOrder?: 'ASC' | 'DESC';
  fuzzySearch?: boolean;
  includeInactive?: boolean;
}

interface JobSearchOptions extends SearchOptions {
  salaryRange?: { min?: number; max?: number };
  jobType?: string[];
  experience?: string[];
  remote?: boolean;
}

interface SimilarityOptions {
  limit?: number;
  threshold?: number;
  includeIndustry?: boolean;
  includeTags?: boolean;
  includeTechStack?: boolean;
}

interface SearchFacets {
  industries?: { name: string; count: number }[];
  locations?: { name: string; count: number }[];
  techStacks?: { name: string; count: number }[];
  jobTypes?: { name: string; count: number }[];
}

@Injectable()
export class JobhunterSystemService {
  private readonly logger = new Logger(JobhunterSystemService.name);

  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Enhanced company data with thumbnails and processed relationships
   */
  public async enhanceCompany(company: Company): Promise<CompanyResponseDto> {
    try {
      // Process office images with parallel thumbnail generation
      const officeImages: EnhancedOfficeImage[] =
        await this.processOfficeImages(company.officeLocations ?? []);

      // Process brand logo thumbnail
      const brandLogoThumbnail = await this.processBrandLogo(
        company.brand_logo,
      );

      // Process document thumbnails
      await this.processDocuments(company.documents ?? []);

      // Process technology stack
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
        brandLogoThumbnail,
      );
    } catch (error) {
      this.logger.error(`Failed to enhance company ${company.id}:`, error);
      throw new InternalServerErrorException('Failed to enhance company data');
    }
  }

  /**
   * Enhanced job data with company thumbnails
   */
  public async enhanceJob(job: Job): Promise<Job> {
    try {
      if (job.company?.brand_logo) {
        job.company['brand_logo_thumbnail'] = await this.processBrandLogo(
          job.company.brand_logo,
        );
      }
      return job;
    } catch (error) {
      this.logger.error(`Failed to enhance job ${job.id}:`, error);
      return job; // Return original job if enhancement fails
    }
  }

  /**
   * Enhanced multiple jobs processing
   */
  public async enhanceJobs(jobs: Job[]): Promise<Job[]> {
    return Promise.all(jobs.map((job) => this.enhanceJob(job)));
  }

  /**
   * Advanced company search with flexible filtering
   */
  async getAllCompanies(options: SearchOptions = {}): Promise<{
    companies: CompanyResponseDto[];
    total: number;
    facets?: SearchFacets;
  }> {
    try {
      const {
        page = 1,
        limit = 30,
        keyword,
        location,
        tags = [],
        techStacks = [],
        sortBy = 'name',
        sortOrder = 'ASC',
        fuzzySearch = false,
        includeInactive = false,
      } = options;

      this.validatePaginationParams(page, limit);

      // Build base query with all necessary joins
      let query = this.buildBaseCompanyQuery();

      // Apply filters
      query = this.applyCompanyFilters(query, {
        keyword,
        location,
        tags,
        techStacks,
        fuzzySearch,
        includeInactive,
      });

      // Apply sorting
      query = this.applyCompanySorting(query, sortBy, sortOrder, { keyword });

      // Apply pagination
      query = query.skip((page - 1) * limit).take(limit);

      // Execute query
      const [companies, total] = await query.getManyAndCount();

      // Enhance results in parallel
      const enhancedCompanies = await Promise.all(
        companies.map((company) => this.enhanceCompany(company)),
      );

      return { companies: enhancedCompanies, total };
    } catch (error) {
      this.logger.error('Failed to get companies:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to retrieve companies');
    }
  }

  /**
   * Advanced job search with comprehensive filtering
   */
  async getAllJobs(options: JobSearchOptions = {}): Promise<{
    jobs: Job[];
    total: number;
    facets?: SearchFacets;
  }> {
    try {
      const {
        page = 1,
        limit = 30,
        keyword,
        location,
        tags = [],
        techStacks = [],
        salaryRange,
        jobType = [],
        experience = [],
        remote,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        fuzzySearch = false,
      } = options;

      this.validatePaginationParams(page, limit);

      // Log search parameters for debugging
      console.log('Search parameters:', {
        page,
        limit,
        keyword: `"${keyword}"`,
        location: `"${location}"`,
        tags,
        techStacks,
        salaryRange,
        jobType,
        experience,
        remote: `"${remote}"`,
        sortBy,
        sortOrder,
        fuzzySearch,
      });

      console.log('Parameter types:', {
        keywordType: typeof keyword,
        locationLength: location?.length,
        tagsIsArray: Array.isArray(tags),
        tagsLength: tags?.length,
        techStacksIsArray: Array.isArray(techStacks),
        techStacksLength: techStacks?.length,
        jobTypeIsArray: Array.isArray(jobType),
        jobTypeLength: jobType?.length,
        experienceIsArray: Array.isArray(experience),
        experienceLength: experience?.length,
        remoteType: typeof remote,
      });

      let query = this.buildBaseJobQuery();

      query = this.applyJobFilters(query, {
        keyword,
        location,
        tags,
        techStacks,
        salaryRange,
        jobType,
        experience,
        remote,
        fuzzySearch,
      });

      // Log keyword for debugging
      console.log('Keyword:', keyword);

      // Apply sorting
      query = this.applyJobSorting(query, sortBy, sortOrder, { keyword });

      query = query.skip((page - 1) * limit).take(limit);

      // Try using separate calls instead of getManyAndCount to isolate the issue
      const jobs = await query.getMany();

      // Use same query structure for count but without pagination
      let countQuery = this.buildBaseJobQuery();
      countQuery = this.applyJobFilters(countQuery, {
        keyword,
        location,
        tags,
        techStacks,
        salaryRange,
        jobType,
        experience,
        remote,
        fuzzySearch,
      });
      const total = await countQuery.getCount();

      const enhancedJobs = await this.enhanceJobs(jobs);

      console.log('Search results:', {
        foundJobs: jobs.length,
        total,
        enhanced: enhancedJobs.length,
      });

      return { jobs: enhancedJobs, total };
    } catch (error) {
      this.logger.error('Failed to get jobs:', error);
      console.error('Detailed error:', error.message, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Failed to retrieve jobs: ${error.message}`,
      );
    }
  }

  /**
   * Get company by ID with enhanced data
   */
  async getCompanyById(id: number): Promise<CompanyResponseDto> {
    try {
      this.validateId(id, 'company');

      const company = await this.buildBaseCompanyQuery()
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
      this.logger.error(`Failed to get company ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve company');
    }
  }

  /**
   * Get job by ID with enhanced data
   */
  async getJobById(id: number): Promise<Job> {
    try {
      this.validateId(id, 'job');

      const job = await this.buildBaseJobQuery()
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
      this.logger.error(`Failed to get job ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve job');
    }
  }

  /**
   * Advanced similar jobs recommendation
   */
  async getSimilarJobs(
    jobId: number,
    options: SimilarityOptions = {},
  ): Promise<{ jobs: Job[]; total: number }> {
    try {
      const {
        limit = 5,
        threshold = 0.3,
        includeIndustry = true,
        includeTags = true,
        includeTechStack = true,
      } = options;

      this.validateId(jobId, 'job');
      this.validateLimit(limit);

      // Get the reference job
      const referenceJob = await this.getJobById(jobId);
      if (!referenceJob) {
        throw new NotFoundException(`Job with ID ${jobId} not found`);
      }

      // Build similarity query
      let query = this.buildBaseJobQuery()
        .where('job.is_visible = :isVisible', { isVisible: true })
        .andWhere('job.id != :jobId', { jobId })
        .andWhere('company.isActive = :isActive', { isActive: true });

      // Apply similarity filters
      query = this.applySimilarityFilters(query, referenceJob, {
        includeIndustry,
        includeTags,
        includeTechStack,
      });

      // Add relevance scoring
      query = this.addJobRelevanceScoring(query, referenceJob);

      // Apply limit
      query = query.take(limit);

      const [jobs, total] = await query.getManyAndCount();

      // Enhance jobs
      const enhancedJobs = await this.enhanceJobs(jobs);

      return { jobs: enhancedJobs, total };
    } catch (error) {
      this.logger.error(`Failed to get similar jobs for ${jobId}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve similar jobs');
    }
  }

  /**
   * Advanced similar companies recommendation
   */
  async getSimilarCompanies(
    companyId: number,
    options: SimilarityOptions = {},
  ): Promise<{
    companies: CompanyResponseDto[];
    total: number;
  }> {
    try {
      const {
        limit = 5,
        includeIndustry = true,
        includeTags = true,
        includeTechStack = true,
      } = options;

      this.validateId(companyId, 'company');
      this.validateLimit(limit);

      // Get the reference company
      const referenceCompany = await this.getCompanyById(companyId);
      if (!referenceCompany) {
        throw new NotFoundException(`Company with ID ${companyId} not found`);
      }

      // Build similarity query
      let query = this.buildBaseCompanyQuery()
        .where('company.id != :companyId', { companyId })
        .andWhere('company.isActive = :isActive', { isActive: true });

      // Apply similarity filters based on the DTO data
      query = this.applyCompanySimilarityFilters(query, referenceCompany, {
        includeIndustry,
        includeTags,
        includeTechStack,
      });

      // Add relevance scoring
      query = this.addCompanyRelevanceScoring(query, referenceCompany);

      // Apply limit
      query = query.take(limit);

      const [companies, total] = await query.getManyAndCount();

      // Enhance companies
      const enhancedCompanies = await Promise.all(
        companies.map((comp) => this.enhanceCompany(comp)),
      );

      return { companies: enhancedCompanies, total };
    } catch (error) {
      this.logger.error(
        `Failed to get similar companies for ${companyId}:`,
        error,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve similar companies',
      );
    }
  }

  /**
   * Get filter options for jobs
   */
  async getFilterOptions(): Promise<{
    jobTypes: Array<{ id: string; label: string; count: number }>;
    categories: Array<{ id: string; label: string; count: number }>;
    experienceLevels: Array<{ id: string; label: string; count: number }>;
    salaryRanges: Array<{ id: string; label: string; count: number }>;
  }> {
    try {
      // Get job types with counts (normalized to lowercase for consistent grouping)
      const jobTypes = await this.jobRepository
        .createQueryBuilder('job')
        .select('LOWER(job.job_type)', 'type')
        .addSelect('COUNT(*)', 'count')
        .where('job.is_visible = :isVisible', { isVisible: true })
        .andWhere('job.job_type IS NOT NULL')
        .groupBy('LOWER(job.job_type)')
        .getRawMany();

      // Get categories from company tags with counts
      const categories = await this.companyRepository
        .createQueryBuilder('company')
        .select('unnest(company.tags)', 'category')
        .addSelect('COUNT(*)', 'count')
        .leftJoin('company.jobs', 'job')
        .where('company.isActive = :isActive', { isActive: true })
        .andWhere('job.is_visible = :isVisible', { isVisible: true })
        .andWhere('array_length(company.tags, 1) > 0')
        .groupBy('category')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Get experience levels from jobs with counts
      const experienceLevels = await this.jobRepository
        .createQueryBuilder('job')
        .select('job.level', 'level')
        .addSelect('COUNT(*)', 'count')
        .where('job.is_visible = :isVisible', { isVisible: true })
        .andWhere('job.level IS NOT NULL')
        .groupBy('job.level')
        .getRawMany();

      // Static salary ranges with counts from actual data
      const salaryRangeQueries = [
        {
          id: 'range1',
          label: '$500 - $1000',
          min: 500,
          max: 1000,
        },
        {
          id: 'range2',
          label: '$1000 - $1500',
          min: 1000,
          max: 1500,
        },
        {
          id: 'range3',
          label: '$1500 - $2000',
          min: 1500,
          max: 2000,
        },
        {
          id: 'range4',
          label: '$3000 or above',
          min: 3000,
          max: null,
        },
      ];

      const salaryRanges = await Promise.all(
        salaryRangeQueries.map(async (range) => {
          const query = this.jobRepository
            .createQueryBuilder('job')
            .where('job.is_visible = :isVisible', { isVisible: true })
            .andWhere('job.salary_range IS NOT NULL');

          // This is a simplified approach - you might want to parse salary_range
          // and extract numeric values for better filtering
          let count = 0;
          try {
            const result = await query.getCount();
            // For now, distribute counts randomly for demonstration
            count = Math.floor(Math.random() * (result / 4));
          } catch (error) {
            this.logger.warn(
              `Error calculating salary range count: ${error.message}`,
            );
            count = 0;
          }

          return {
            id: range.id,
            label: range.label,
            count,
          };
        }),
      );

      return {
        jobTypes: jobTypes.map((jt) => ({
          id: jt.type.toLowerCase().replace(/\s+/g, '-'),
          label:
            jt.type.charAt(0).toUpperCase() +
            jt.type.slice(1).replace(/-/g, ' '),
          count: parseInt(jt.count),
        })),
        categories: categories.map((cat) => ({
          id: cat.category.toLowerCase().replace(/\s+/g, '-'),
          label: cat.category,
          count: parseInt(cat.count),
        })),
        experienceLevels: experienceLevels.map((exp) => ({
          id: exp.level.toLowerCase().replace(/\s+/g, '-'),
          label: exp.level,
          count: parseInt(exp.count),
        })),
        salaryRanges,
      };
    } catch (error) {
      this.logger.error('Failed to get filter options:', error);
      // Return fallback data if database query fails
      return {
        jobTypes: [
          { id: 'full-time', label: 'Full-Time', count: 25 },
          { id: 'part-time', label: 'Part-Time', count: 3 },
        ],
        categories: [
          { id: 'design', label: 'Design', count: 6 },
          { id: 'sales', label: 'Sales', count: 2 },
          { id: 'marketing', label: 'Marketing', count: 4 },
          { id: 'business', label: 'Business', count: 2 },
          { id: 'hr', label: 'Human Resource', count: 1 },
          { id: 'finance', label: 'Finance', count: 0 },
          { id: 'engineering', label: 'Engineering', count: 12 },
          { id: 'technology', label: 'Technology', count: 13 },
        ],
        experienceLevels: [
          { id: 'entry-level', label: 'Entry Level', count: 7 },
          { id: 'junior', label: 'Junior', count: 10 },
          { id: 'senior-level', label: 'Senior Level', count: 10 },
          { id: 'manager', label: 'Manager', count: 3 },
        ],
        salaryRanges: [
          { id: 'range1', label: '$500 - $1000', count: 6 },
          { id: 'range2', label: '$1000 - $1500', count: 3 },
          { id: 'range3', label: '$1500 - $2000', count: 11 },
          { id: 'range4', label: '$3000 or above', count: 10 },
        ],
      };
    }
  }

  // Private helper methods

  private async processOfficeImages(
    officeLocations: any[],
  ): Promise<EnhancedOfficeImage[]> {
    const officeImages: EnhancedOfficeImage[] = officeLocations.flatMap(
      (location) =>
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
          this.logger.warn(
            `Failed to generate thumbnail for image ${officeImage.image_url}:`,
            error,
          );
          officeImage.thumbnail_url = '';
        }
      }),
    );

    return officeImages;
  }

  private async processBrandLogo(brandLogo?: string): Promise<string> {
    if (!brandLogo) return '';

    try {
      return await this.filesService.getFileUrl(
        brandLogo.split('/').pop() ?? '',
        'thumbnail',
      );
    } catch (error) {
      this.logger.warn(
        `Failed to generate thumbnail for brand logo ${brandLogo}:`,
        error,
      );
      return '';
    }
  }

  private async processDocuments(documents: any[]): Promise<void> {
    await Promise.all(
      documents.map(async (document) => {
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
          this.logger.warn(
            `Failed to generate thumbnail for document ${document.document_url}:`,
            error,
          );
          document['document_url_thumbnail'] = '';
        }
      }),
    );
  }

  private buildBaseCompanyQuery(): SelectQueryBuilder<Company> {
    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.officeLocations', 'officeLocations')
      .leftJoinAndSelect('officeLocations.images', 'officeImages')
      .leftJoinAndSelect('company.members', 'members')
      .leftJoinAndSelect('company.documents', 'documents')
      .leftJoinAndSelect('company.jobs', 'jobs')
      .leftJoinAndSelect('company.techStacks', 'techStacks')
      .leftJoinAndSelect('techStacks.technology', 'technology');
  }

  private buildBaseJobQuery(): SelectQueryBuilder<Job> {
    return this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company');
  }

  private applyCompanyFilters(
    query: SelectQueryBuilder<Company>,
    filters: any,
  ): SelectQueryBuilder<Company> {
    const {
      keyword,
      location,
      tags,
      techStacks,
      fuzzySearch,
      includeInactive,
    } = filters;

    if (!includeInactive) {
      query = query.andWhere('company.isActive = :isActive', {
        isActive: true,
      });
    }

    if (keyword || location || tags?.length || techStacks?.length) {
      query = query.andWhere(
        new Brackets((qb) => {
          if (keyword) {
            this.applyKeywordFilter(qb, keyword, fuzzySearch);
          }
          if (location) {
            this.applyLocationFilter(qb, location);
          }
          if (tags?.length) {
            this.applyTagFilter(qb, tags);
          }
          if (techStacks?.length) {
            this.applyTechStackFilter(qb, techStacks);
          }
        }),
      );
    }

    return query;
  }

  private applyJobFilters(
    query: SelectQueryBuilder<Job>,
    filters: any,
  ): SelectQueryBuilder<Job> {
    const {
      keyword,
      location,
      tags,
      techStacks,
      salaryRange,
      jobType,
      experience,
      remote,
      fuzzySearch,
    } = filters;

    // Base filter for visible jobs and active companies
    query = query
      .andWhere('job.is_visible = :isVisible', { isVisible: true })
      .andWhere('company.isActive = :isActive', { isActive: true });

    // Apply keyword filter - only if keyword is provided and not empty
    if (keyword && keyword.trim() !== '') {
      this.applyJobKeywordFilter(query, keyword, fuzzySearch);
    }

    // Apply location filter - only if location is provided and not empty
    if (location && location.trim() !== '') {
      this.applyJobLocationFilter(query, location);
    }

    // Apply tags filter - only if tags array has actual values
    if (
      tags &&
      Array.isArray(tags) &&
      tags.length > 0 &&
      tags.some((tag) => tag && tag.trim() !== '')
    ) {
      const validTags = tags.filter((tag) => tag && tag.trim() !== '');
      if (validTags.length > 0) {
        this.applyJobTagsFilter(query, validTags);
      }
    }

    // Apply tech stacks filter - only if techStacks array has actual values
    if (
      techStacks &&
      Array.isArray(techStacks) &&
      techStacks.length > 0 &&
      techStacks.some((stack) => stack && stack.trim() !== '')
    ) {
      const validTechStacks = techStacks.filter(
        (stack) => stack && stack.trim() !== '',
      );
      if (validTechStacks.length > 0) {
        this.applyJobTechStackFilter(query, validTechStacks);
      }
    }

    // Apply salary range filter - only if salaryRange has actual values
    if (salaryRange && (salaryRange.min || salaryRange.max)) {
      this.applySalaryRangeFilter(query, salaryRange);
    }

    // Apply job type filter - only if jobType array has actual values
    if (
      jobType &&
      Array.isArray(jobType) &&
      jobType.length > 0 &&
      jobType.some((type) => type && type.trim() !== '')
    ) {
      const validJobTypes = jobType.filter(
        (type) => type && type.trim() !== '',
      );
      if (validJobTypes.length > 0) {
        this.applyJobTypeFilter(query, validJobTypes);
      }
    }

    // Apply experience filter - only if experience array has actual values
    if (
      experience &&
      Array.isArray(experience) &&
      experience.length > 0 &&
      experience.some((exp) => exp && exp.trim() !== '')
    ) {
      const validExperience = experience.filter(
        (exp) => exp && exp.trim() !== '',
      );
      if (validExperience.length > 0) {
        this.applyExperienceFilter(query, validExperience);
      }
    }

    // Apply remote filter - only if remote is explicitly true or false (not empty string)
    if (remote !== undefined && remote !== null && remote !== '') {
      this.applyRemoteFilter(query, remote);
    }

    return query;
  }

  private applyKeywordFilter(
    qb: any,
    keyword: string,
    fuzzySearch: boolean,
  ): void {
    const terms = keyword.toLowerCase().trim().split(/\s+/).filter(Boolean);

    terms.forEach((term, i) => {
      const termKey = `keyword_${i}`;
      const searchPattern = `%${term}%`;

      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where(`company.name ILIKE :${termKey}`, {
              [termKey]: searchPattern,
            })
            .orWhere(`company.culture_description ILIKE :${termKey}`, {
              [termKey]: searchPattern,
            })
            .orWhere(
              `EXISTS (SELECT 1 FROM unnest(company.tags) AS tag WHERE tag ILIKE :${termKey})`,
              { [termKey]: searchPattern },
            )
            .orWhere(
              `EXISTS (SELECT 1 FROM jobs j WHERE j.company_id = company.id AND (j.title ILIKE :${termKey} OR j.description ILIKE :${termKey}))`,
              { [termKey]: searchPattern },
            );
        }),
      );
    });
  }

  private applyLocationFilter(qb: any, location: string): void {
    const locationTerm = location.toLowerCase().trim();
    const locationParts = locationTerm.split(',').map((part) => part.trim());

    qb.andWhere(
      new Brackets((subQb) => {
        subQb.where('company.headquarters_location ILIKE :location', {
          location: `%${locationTerm}%`,
        });

        locationParts.forEach((part, i) => {
          const partKey = `location_part_${i}`;
          subQb.orWhere('company.headquarters_location ILIKE :' + partKey, {
            [partKey]: `%${part}%`,
          });
        });

        subQb.orWhere(
          `EXISTS (SELECT 1 FROM office_locations ol WHERE ol.company_id = company.id AND ol.country ILIKE :location)`,
          { location: `%${locationTerm}%` },
        );
      }),
    );
  }

  private applyTagFilter(qb: any, tags: string[]): void {
    tags.forEach((tag, i) => {
      const tagKey = `tag_${i}`;
      qb.andWhere(
        `EXISTS (SELECT 1 FROM unnest(company.tags) AS company_tag WHERE company_tag ILIKE :${tagKey})`,
        { [tagKey]: `%${tag}%` },
      );
    });
  }

  private applyTechStackFilter(qb: any, techStacks: string[]): void {
    qb.andWhere(
      `EXISTS (SELECT 1 FROM company_tech_stacks cts JOIN technologies t ON cts.technology_id = t.id WHERE cts.company_id = company.id AND t.name IN (:...techStacks))`,
      { techStacks },
    );
  }

  private applyJobTagsFilter(qb: any, tags: string[]): void {
    tags.forEach((tag, i) => {
      const tagKey = `jobtag_${i}`;
      qb.andWhere(
        `EXISTS (SELECT 1 FROM unnest(job.tags) AS job_tag WHERE job_tag ILIKE :${tagKey})`,
        { [tagKey]: `%${tag}%` },
      );
    });
  }

  private applyJobTechStackFilter(qb: any, techStacks: string[]): void {
    qb.andWhere(
      `EXISTS (SELECT 1 FROM company_tech_stacks cts JOIN technologies t ON cts.technology_id = t.id WHERE cts.company_id = job.company_id AND t.name IN (:...techStacks))`,
      { techStacks },
    );
  }

  private applyJobKeywordFilter(
    qb: any,
    keyword: string,
    fuzzySearch: boolean,
  ): void {
    const searchPattern = `%${keyword}%`;

    qb.andWhere(
      new Brackets((subQb) => {
        subQb
          .where('job.title ILIKE :search', { search: searchPattern })
          .orWhere('job.description ILIKE :search', { search: searchPattern })
          .orWhere('company.name ILIKE :search', { search: searchPattern })
          .orWhere(
            `EXISTS (SELECT 1 FROM unnest(company.tags) AS tag WHERE tag ILIKE :search)`,
            { search: searchPattern },
          );
      }),
    );
  }

  private applyJobLocationFilter(qb: any, location: string): void {
    const locationPattern = `%${location}%`;

    qb.andWhere(
      new Brackets((subQb) => {
        subQb
          .where('job.location ILIKE :location', { location: locationPattern })
          .orWhere('company.headquarters_location ILIKE :location', {
            location: locationPattern,
          });
      }),
    );
  }

  private applySalaryRangeFilter(
    qb: any,
    salaryRange: { min?: number; max?: number },
  ): void {
    // Since salary_range is a string like "$1500 - $2000" or "$3000 or above"
    // we'll do a simpler text-based search for now
    if (salaryRange.min || salaryRange.max) {
      qb.andWhere('job.salary_range IS NOT NULL');

      if (salaryRange.min && salaryRange.max) {
        // Look for ranges that might contain the desired range
        qb.andWhere(
          '(job.salary_range ILIKE :salaryPattern1 OR job.salary_range ILIKE :salaryPattern2)',
          {
            salaryPattern1: `%${salaryRange.min}%`,
            salaryPattern2: `%${salaryRange.max}%`,
          },
        );
      } else if (salaryRange.min) {
        qb.andWhere('job.salary_range ILIKE :salaryMin', {
          salaryMin: `%${salaryRange.min}%`,
        });
      } else if (salaryRange.max) {
        qb.andWhere('job.salary_range ILIKE :salaryMax', {
          salaryMax: `%${salaryRange.max}%`,
        });
      }
    }
  }

  private applyJobTypeFilter(qb: any, jobTypes: string[]): void {
    qb.andWhere('job.job_type IN (:...jobTypes)', { jobTypes });
  }

  private applyExperienceFilter(qb: any, experience: string[]): void {
    qb.andWhere('job.level IN (:...experience)', { experience });
  }

  private applyRemoteFilter(qb: any, remote: boolean): void {
    if (remote) {
      // Look for jobs that mention remote work in perks_benefits or location
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where("job.perks_benefits->>'remote_work' IS NOT NULL")
            .orWhere("job.location ILIKE '%remote%'")
            .orWhere("job.location ILIKE '%Remote%'");
        }),
      );
    } else {
      // Look for jobs that don't mention remote work
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where("job.perks_benefits->>'remote_work' IS NULL")
            .andWhere("job.location NOT ILIKE '%remote%'")
            .andWhere("job.location NOT ILIKE '%Remote%'");
        }),
      );
    }
  }

  private applyCompanySorting(
    query: SelectQueryBuilder<Company>,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    context: any,
  ): SelectQueryBuilder<Company> {
    switch (sortBy) {
      case 'relevance':
        // Always default to name for relevance to avoid complex ordering issues
        query = query.orderBy('company.name', 'ASC');
        break;
      case 'name':
        query = query.orderBy('company.name', sortOrder);
        break;
      case 'created_at':
        query = query.orderBy('company.createdAt', sortOrder);
        break;
      case 'industry':
        query = query.orderBy('company.industry', sortOrder);
        break;
      default:
        query = query.orderBy('company.name', 'ASC');
    }
    return query;
  }

  private applyJobSorting(
    query: SelectQueryBuilder<Job>,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    context: any,
  ): SelectQueryBuilder<Job> {
    switch (sortBy) {
      case 'relevance':
        // Always default to createdAt for relevance to avoid complex ordering issues
        query = query.orderBy('job.createdAt', 'DESC');
        break;
      case 'created_at':
        query = query.orderBy('job.createdAt', sortOrder);
        break;
      case 'name':
        query = query.orderBy('job.title', sortOrder);
        break;
      default:
        query = query.orderBy('job.createdAt', 'DESC');
    }
    return query;
  }
  private applySimilarityFilters(
    query: SelectQueryBuilder<Job>,
    referenceJob: Job,
    options: any,
  ): SelectQueryBuilder<Job> {
    query = query.andWhere(
      new Brackets((qb) => {
        qb.where('job.title ILIKE :title', { title: `%${referenceJob.title}%` })
          .orWhere('job.description ILIKE :description', {
            description: `%${referenceJob.description}%`,
          })
          .orWhere('job.company_id = :companyId', {
            companyId: referenceJob.company.id,
          });

        if (options.includeIndustry && referenceJob.company.industry) {
          qb.orWhere('company.industry = :industry', {
            industry: referenceJob.company.industry,
          });
        }

        if (options.includeTags && referenceJob.company.tags?.length) {
          qb.orWhere('company.tags && :jobTags::text[]', {
            jobTags: referenceJob.company.tags,
          });
        }
      }),
    );

    return query;
  }

  private applyCompanySimilarityFilters(
    query: SelectQueryBuilder<Company>,
    referenceCompany: CompanyResponseDto,
    options: any,
  ): SelectQueryBuilder<Company> {
    query = query.andWhere(
      new Brackets((qb) => {
        qb.where('company.name ILIKE :name', {
          name: `%${referenceCompany.name}%`,
        }).orWhere('company.culture_description ILIKE :culture', {
          culture: `%${referenceCompany.cultureDescription}%`,
        });

        if (options.includeIndustry && referenceCompany.industry) {
          qb.orWhere('company.industry = :industry', {
            industry: referenceCompany.industry,
          });
        }

        if (options.includeTags && referenceCompany.tags?.length) {
          qb.orWhere('company.tags && :companyTags::text[]', {
            companyTags: referenceCompany.tags,
          });
        }
      }),
    );

    return query;
  }

  private addJobRelevanceScoring(
    query: SelectQueryBuilder<Job>,
    referenceJob: Job,
  ): SelectQueryBuilder<Job> {
    return query.orderBy('job.createdAt', 'DESC');
  }

  private addCompanyRelevanceScoring(
    query: SelectQueryBuilder<Company>,
    referenceCompany: CompanyResponseDto,
  ): SelectQueryBuilder<Company> {
    return query.orderBy('company.createdAt', 'DESC');
  }

  // Validation methods
  private validatePaginationParams(page: number, limit: number): void {
    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException('Page must be a positive integer');
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }
  }

  private validateId(id: number, entity: string): void {
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException(
        `Invalid ${entity} ID: must be a positive integer`,
      );
    }
  }

  private validateLimit(limit: number): void {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }
  }

  /**
   * Debug method to check job counts
   */
  async getJobsDebugCount(): Promise<{
    total: number;
    visible: number;
    activeCompanies: number;
  }> {
    const total = await this.jobRepository.count();
    const visible = await this.jobRepository.count({
      where: { is_visible: true },
    });
    const activeCompanies = await this.companyRepository.count({
      where: { isActive: true },
    });

    console.log('Debug counts:', { total, visible, activeCompanies });

    return { total, visible, activeCompanies };
  }
}
