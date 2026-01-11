import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Company } from '../companies/entities/company.entity';
import { UsersSeeder } from './seeds/users.seeder';
import { RolesSeeder } from './seeds/roles.seeder';
import { CompaniesSeeder } from './seeds/companies.seeder';

import { Job } from 'src/companies/entities/job.entity';
import { JobsSeeder } from './seeds/jobs.seeders';
import { Technology } from 'src/companies/technology/technology.entity';
import { TechnologySeeder } from './seeds/technologies.seeder';
import { MembersSeeder } from './seeds/members.seeder';
import { Member } from 'src/companies/entities/member.entity';
import { JobSeekersSeeder } from './seeds/jobseekers.seeder';
import { JobSeeker } from 'src/jobseekers/entities/jobseeker.entity';
import { CompanyTechStack } from 'src/companies/entities/company-tech-stack.entity';
import { CompanyTechStackSeeder } from './seeds/company_techstack.seeder';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectRepository(Technology)
    private readonly techRepo: Repository<Technology>,

    @InjectRepository(JobSeeker)
    private readonly jobseekerRepo: Repository<JobSeeker>,
    @InjectRepository(Member)
    private readonly MemberRepo: Repository<Member>,

    @InjectRepository(CompanyTechStack)
    private readonly CompanyTechStackRepo: Repository<CompanyTechStack>,
  ) {}

  async run() {
    const roles = await new RolesSeeder(this.roleRepo, this.userRepo).run();
    const users = await new UsersSeeder(this.userRepo, roles).run();
    const technologies = await new TechnologySeeder(this.techRepo).run();
    const companies = await new CompaniesSeeder(this.companyRepo, users).run();

    const members = await new MembersSeeder(
      this.MemberRepo,
      this.companyRepo,
    ).run();

    const techstacks = await new CompanyTechStackSeeder(
      this.CompanyTechStackRepo,
      this.companyRepo,
      this.techRepo,
    ).run();

    // const members = await new MembersSeeder(this.MemberRepo, companies).run();
    const jobs = await new JobsSeeder(
      this.jobRepo,
      this.companyRepo,
      users,
    ).run();

    const jobseekers = await new JobSeekersSeeder(
      this.jobseekerRepo,
      this.jobRepo,
      users,
    ).run();
  }
}
