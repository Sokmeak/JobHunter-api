import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  BadRequestException,
  ParseArrayPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { JobhunterSystemService } from './jobhunter-system.service';
import { Job } from '../companies/entities/job.entity';

import { CompanyResponseDto } from 'src/companies/dto/company-response.dto';

@Controller('jobhunter-system')
export class JobhunterSystemController {
  constructor(
    private readonly jobhunterSystemService: JobhunterSystemService,
  ) {}

  @Get('all-companies')
  async getAllCompanies(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
    @Query('keyword') keyword?: string,
    @Query('location') location?: string,
    @Query(
      'tags',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    tags?: string[],
    @Query(
      'techStacks',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    techStacks?: string[],
    @Query('sortBy')
    sortBy: 'name' | 'created_at' | 'relevance' | 'industry' = 'name',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('fuzzySearch', new ParseBoolPipe({ optional: true }))
    fuzzySearch: boolean = false,
    @Query('includeInactive', new ParseBoolPipe({ optional: true }))
    includeInactive: boolean = false,
  ): Promise<{ companies: CompanyResponseDto[]; total: number; facets?: any }> {
    const options = {
      page,
      limit,
      keyword,
      location,
      tags,
      techStacks,
      sortBy,
      sortOrder,
      fuzzySearch,
      includeInactive,
    };

    return this.jobhunterSystemService.getAllCompanies(options);
  }

  @Get('all-jobs')
  async getAllJobs(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
    @Query('keyword') keyword?: string,
    @Query('location') location?: string,
    @Query(
      'tags',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    tags?: string[],
    @Query(
      'techStacks',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    techStacks?: string[],
    @Query('salaryMin', new ParseIntPipe({ optional: true }))
    salaryMin?: number,
    @Query('salaryMax', new ParseIntPipe({ optional: true }))
    salaryMax?: number,
    @Query(
      'jobType',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    jobType?: string[],
    @Query(
      'experience',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    experience?: string[],
    @Query('remote', new ParseBoolPipe({ optional: true })) remote?: boolean,
    @Query('sortBy') sortBy: 'name' | 'created_at' | 'relevance' = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('fuzzySearch', new ParseBoolPipe({ optional: true }))
    fuzzySearch: boolean = false,
  ): Promise<{ jobs: Job[]; total: number; facets?: any }> {
    const options = {
      page,
      limit,
      keyword,
      location,
      tags,
      techStacks,
      salaryRange:
        salaryMin || salaryMax ? { min: salaryMin, max: salaryMax } : undefined,
      jobType,
      experience,
      remote,
      sortBy,
      sortOrder,
      fuzzySearch,
    };

    return this.jobhunterSystemService.getAllJobs(options);
  }

  @Get('filter-options')
  async getFilterOptions(): Promise<{
    jobTypes: Array<{ id: string; label: string; count: number }>;
    categories: Array<{ id: string; label: string; count: number }>;
    experienceLevels: Array<{ id: string; label: string; count: number }>;
    salaryRanges: Array<{ id: string; label: string; count: number }>;
  }> {
    return this.jobhunterSystemService.getFilterOptions();
  }

  @Get('companies/:id')
  async getCompanyById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CompanyResponseDto> {
    if (id < 1) throw new BadRequestException('Invalid company ID');
    return await this.jobhunterSystemService.getCompanyById(id);
  }

  @Get('jobs/:id')
  async getJobById(@Param('id', ParseIntPipe) id: number): Promise<Job> {
    if (id < 1) throw new BadRequestException('Invalid job ID');
    return this.jobhunterSystemService.getJobById(id);
  }

  @Get('jobs/:id/similar')
  async getSimilarJobs(
    @Param('id') id: number,
    @Param('limit') limit: number = 5,
  ): Promise<{ jobs: Job[]; total: number }> {
    if (id < 1) throw new BadRequestException('Invalid job ID');
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    return this.jobhunterSystemService.getSimilarJobs(id);
  }

  @Get('companies/:id/similar')
  async getSimilarCompanies(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 5,
  ): Promise<{ companies: CompanyResponseDto[]; total: number }> {
    if (id < 1) throw new BadRequestException('Invalid company ID');
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    return this.jobhunterSystemService.getSimilarCompanies(id);
  }
}
