import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { BcryptProvider } from 'src/users/bcrypt.provider';
import { Member } from './entities/member.entity';
import { Technology } from './entities/technology.entity';
import { CompanyTechStack } from './entities/company-tech-stack.entity';
import { OfficeLocation } from './entities/office-location.entity';
import { OfficeImage } from './entities/office-image.entity';

import { CompanyDocument } from './entities/company-document.entity';
import { Job } from './entities/job.entity';
import { JobApplication } from './entities/job-application.entity';
import { Interview } from './entities/interview.entity';
import { User } from 'src/users/entities/user.entity';
import { FilesService } from 'src/files/files.service';
import { Notification } from './entities/notification.entity';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Member,
      Technology,
      CompanyTechStack,
      OfficeLocation,
      OfficeImage,
 
      CompanyDocument,
      Job,
      JobApplication,
      Interview,
      Notification,
      User,
      Role,
    ]),
  ],

  controllers: [CompaniesController],

  providers: [CompaniesService, UsersService, BcryptProvider, FilesService],
})
export class CompaniesModule {}
