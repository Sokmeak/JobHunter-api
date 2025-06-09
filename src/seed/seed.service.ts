import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Company } from '../companies/entities/company.entity';
import { UsersSeeder } from './seeds/users.seeder';
import { RolesSeeder } from './seeds/roles.seeder';
import { CompaniesSeeder } from './seeds/companies.seeder';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async run() {
    const roles = await new RolesSeeder(this.roleRepo, this.userRepo).run();
    const users = await new UsersSeeder(this.userRepo, roles).run();
  }
}
