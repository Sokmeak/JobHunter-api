import { Repository } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';

export class CompaniesSeeder {
  constructor(
    private readonly companyRepository: Repository<Company>,
    private readonly users: User[],
  ) {}

  async run(): Promise<Company[]> {
    await this.companyRepository.clear();

    return await this.companyRepository.save([
      {
        name: 'Tech Corp',
        email: 'contact@techcorp.com',
        website_url: 'https://techcorp.com',
        founded_date: '2010-01-01',
        employee_count: '100',
        userId: this.users[0].id,
      },
      {
        name: 'Green Innovations',
        email: 'hello@greeninnovations.io',
        website_url: 'https://greeninnovations.io',
        founded_date: '2015-06-15',
        employee_count: '50',
        userId: this.users[1].id,
      },
    ]);
  }
}
