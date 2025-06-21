import { PartialType } from '@nestjs/mapped-types';
import { CreateJobhunterSystemDto } from './create-jobhunter-system.dto';

export class UpdateJobhunterSystemDto extends PartialType(CreateJobhunterSystemDto) {}
