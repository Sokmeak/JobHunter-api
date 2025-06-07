import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { BcryptProvider } from 'src/users/bcrypt.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Company]),UsersModule, RolesModule],
  controllers: [CompaniesController],

  providers: [CompaniesService, UsersService, BcryptProvider],
})
export class CompaniesModule {}
