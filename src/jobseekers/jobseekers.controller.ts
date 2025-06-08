import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobseekersService } from './jobseekers.service';
import { CreateJobseekerDto } from './dto/create-jobseeker.dto';
import { UpdateJobseekerDto } from './dto/update-jobseeker.dto';

@Controller('jobseekers')
export class JobseekersController {
  constructor(private readonly jobseekersService: JobseekersService) {}

  @Post()
  create(@Body() createJobseekerDto: CreateJobseekerDto) {
    return this.jobseekersService.create(createJobseekerDto);
  }

  @Get()
  findAll() {
    return this.jobseekersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobseekersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobseekerDto: UpdateJobseekerDto) {
    return this.jobseekersService.update(+id, updateJobseekerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobseekersService.remove(+id);
  }
}
