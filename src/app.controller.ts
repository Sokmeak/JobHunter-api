import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  ParseArrayPipe,
  ParseBoolPipe,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JobhunterSystemService } from './jobhunter-system/jobhunter-system.service';
import { Job } from './companies/entities/job.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jobhunterSystemService: JobhunterSystemService,
  ) {}

  @Get()
  letStart(): string {
    return this.appService.getStarted();
  }

  @Get('debug/jobs-count')
  async getJobsCount(): Promise<{
    total: number;
    visible: number;
    activeCompanies: number;
  }> {
    // Debug endpoint to check job counts
    const total = await this.jobhunterSystemService.getJobsDebugCount();
    return total;
  }

  @Get('jobs')
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
    if (page < 1)
      throw new BadRequestException('Page must be a positive integer');
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

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
}
