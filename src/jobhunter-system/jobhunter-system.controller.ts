import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { JobhunterSystemService } from './jobhunter-system.service';
import { Job } from '../companies/entities/job.entity';
import { Company } from '../companies/entities/company.entity';

@Controller('jobhunter-system')
export class JobhunterSystemController {
  constructor(
    private readonly jobhunterSystemService: JobhunterSystemService,
  ) {}

  @Get('all-companies')
  async getAllCompanies(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
    @Query('searchkeyparam') searchkeyparam?: string,
    @Query('location') location?: string,
  ): Promise<{ companies: Company[]; total: number }> {
    if (page < 1)
      throw new BadRequestException('Page must be a positive integer');
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    return this.jobhunterSystemService.getAllCompanies(
      page,
      limit,
      searchkeyparam,
      location,
    );
  }

  @Get('all-jobs')
  async getAllJobs(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
    @Query('searchkeyparam') searchkeyparam?: string,
    @Query('location') location?: string,
  ): Promise<{ jobs: Job[]; total: number }> {
    if (page < 1)
      throw new BadRequestException('Page must be a positive integer');
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    return this.jobhunterSystemService.getAllJobs(
      page,
      limit,
      searchkeyparam,
      location,
    );
  }

  // @Get('companies/:id')
  // async getCompanyById(
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<Company> {
  //   if (id < 1) throw new BadRequestException('Invalid company ID');
  //   return this.jobhunterSystemService.getCompanyById(id);
  // }

  @Get('jobs/:id')
  async getJobById(@Param('id', ParseIntPipe) id: number): Promise<Job> {
    if (id < 1) throw new BadRequestException('Invalid job ID');
    return this.jobhunterSystemService.getJobById(id);
  }

  @Get('jobs/:id/similar')
  async getSimilarJobs(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 5,
  ): Promise<{ jobs: Job[]; total: number }> {
    if (id < 1) throw new BadRequestException('Invalid job ID');
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    return this.jobhunterSystemService.getSimilarJobs(id, limit);
  }

  @Get('companies/:id/similar')
  async getSimilarCompanies(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 5,
  ): Promise<{ companies: Company[]; total: number }> {
    if (id < 1) throw new BadRequestException('Invalid company ID');
    if (limit < 1)
      throw new BadRequestException('Limit must be a positive integer');

    return this.jobhunterSystemService.getSimilarCompanies(id, limit);
  }
}
