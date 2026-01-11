import { PartialType } from '@nestjs/mapped-types';
import { CreateJobSeekerDto } from './create-jobseeker.dto';

export class UpdateJobseekerDto extends PartialType(CreateJobSeekerDto) {}
