import { Injectable } from '@nestjs/common';
import { CreateJobseekerDto } from './dto/create-jobseeker.dto';
import { UpdateJobseekerDto } from './dto/update-jobseeker.dto';

@Injectable()
export class JobseekersService {
  create(createJobseekerDto: CreateJobseekerDto) {
    return 'This action adds a new jobseeker';
  }

  findAll() {
    return `This action returns all jobseekers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobseeker`;
  }

  update(id: number, updateJobseekerDto: UpdateJobseekerDto) {
    return `This action updates a #${id} jobseeker`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobseeker`;
  }
}
