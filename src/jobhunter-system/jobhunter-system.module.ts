import { Module } from '@nestjs/common';
import { JobhunterSystemService } from './jobhunter-system.service';
import { JobhunterSystemController } from './jobhunter-system.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from '../companies/entities/job.entity';
import { Company } from '../companies/entities/company.entity';
import { FilesService } from 'src/files/files.service';

@Module({
   imports: [TypeOrmModule.forFeature([Job, Company])],
  controllers: [JobhunterSystemController],
  providers: [JobhunterSystemService, FilesService],
})
export class JobhunterSystemModule {}
