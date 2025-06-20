import { Repository } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';

// CompaniesSeeder (updated with only requested fields and user_id at the top)
export class CompaniesSeeder {
  constructor(
    private readonly companyRepository: Repository<Company>,
    private readonly users: User[],
  ) {}

  async run(): Promise<Company[]> {
    // Comment out clear to avoid accidental data loss
    //  await this.companyRepository.clear();

    await this.companyRepository.createQueryBuilder().delete().execute();

    // Filter only EMPLOYER users (first 10 users)
    const employerUsers = this.users.slice(0, 10);

    // Validate that we have enough EMPLOYER users with valid IDs
    if (employerUsers.length < 10 || employerUsers.some((user) => !user.id)) {
      throw new Error(
        'Insufficient or invalid EMPLOYER users for seeding companies',
      );
    }

    const companies: Partial<Company>[] = [
      {
        user_id: employerUsers[0].id,
        name: 'Tech Solutions Inc.',
        email: 'contact@techsolutions.com',
        website_url: 'https://techsolutions.com',
        founded_date: '2010-01-01',
        employee_count: '100',
        hr_contact_name: 'Employer One',
        hr_contact_email: 'employer1@example.com',
        industry: 'Technology',
        headquarters_location: 'San Francisco, USA',
        isActive: true,
        isVerified: false,
      },
      {
        user_id: employerUsers[1].id,
        name: 'Innovate Labs',
        email: 'hello@innovatelabs.io',
        website_url: 'https://innovatelabs.io',
        founded_date: '2015-06-15',
        employee_count: '50',
        hr_contact_name: 'Employer Two',
        hr_contact_email: 'employer2@example.com',
        industry: 'Software Development',
        headquarters_location: 'Berlin, Germany',
        isActive: true,
        isVerified: false,
      },
      {
        user_id: employerUsers[2].id,
        name: 'Green Tech Corp',
        email: 'info@greentechcorp.com',
        website_url: 'https://greentechcorp.com',
        founded_date: '2018-03-10',
        employee_count: '75',
        hr_contact_name: 'Employer Three',
        hr_contact_email: 'employer3@example.com',
        industry: 'Renewable Energy',
        headquarters_location: 'Toronto, Canada',
        isActive: true,
        isVerified: false,
      },
      {
        user_id: employerUsers[3].id,
        name: 'NextGen Solutions',
        email: 'support@nextgensolutions.com',
        website_url: 'https://nextgensolutions.com',
        founded_date: '2012-09-01',
        employee_count: '200',
        hr_contact_name: 'Employer Four',
        hr_contact_email: 'employer4@example.com',
        industry: 'IT Services',
        headquarters_location: 'Paris, France',
        isActive: true,
        isVerified: false,
      },
      {
        user_id: employerUsers[4].id,
        name: 'Creative Minds Ltd.',
        email: 'contact@creativeminds.com',
        website_url: 'https://creativeminds.com',
        founded_date: '2016-11-20',
        employee_count: '30',
        hr_contact_name: 'Employer Five',
        hr_contact_email: 'employer5@example.com',
        industry: 'Design',
        headquarters_location: 'Amsterdam, Netherlands',
        isActive: true,
        isVerified: false,
      },
      {
        user_id: employerUsers[5].id,
        name: 'Data Dynamics',
        email: 'info@datadynamics.io',
        website_url: 'https://datadynamics.io',
        founded_date: '2014-04-05',
        employee_count: '120',
        hr_contact_name: 'Employer Six',
        hr_contact_email: 'employer6@example.com',
        industry: 'Data Analytics',
        headquarters_location: 'New York, USA',
        isActive: true,
        isVerified: false,
      },
      {
        user_id: employerUsers[6].id,
        name: 'Health Innovators',
        email: 'contact@healthinnovators.com',
        website_url: 'https://healthinnovators.com',
        founded_date: '2019-07-15',
        employee_count: '60',
        hr_contact_name: 'Employer Seven',
        hr_contact_email: 'employer7@example.com',
        industry: 'Healthcare',
        headquarters_location: 'London, UK',
        isActive: true,
        isVerified: false,
      },
      {
        user_id: employerUsers[7].id,
        name: 'Smart Systems',
        email: 'hello@smartsystems.com',
        website_url: 'https://smartsystems.com',
        founded_date: '2013-02-28',
        employee_count: '90',
        hr_contact_name: 'Employer Eight',
        hr_contact_email: 'employer8@example.com',
        industry: 'Automation',
        headquarters_location: 'Tokyo, Japan',
        isActive: true,
        isVerified: false,
      },
      {
        user_id: employerUsers[8].id,
        name: 'EduTech Solutions',
        email: 'support@edutechsolutions.com',
        website_url: 'https://edutechsolutions.com',
        founded_date: '2017-12-01',
        employee_count: '45',
        hr_contact_name: 'Employer Nine',
        hr_contact_email: 'employer9@example.com',
        industry: 'Education Technology',
        headquarters_location: 'Sydney, Australia',
        isActive: true,
        isVerified: false,
      },
      {
        user_id: employerUsers[9].id,
        name: 'FinTech Ventures',
        email: 'info@fintechventures.com',
        website_url: 'https://fintechventures.com',
        founded_date: '2011-05-10',
        employee_count: '150',
        hr_contact_name: 'Employer Ten',
        hr_contact_email: 'employer10@example.com',
        industry: 'Financial Technology',
        headquarters_location: 'Singapore',
        isActive: true,
        isVerified: false,
      },
    ];

    const result = await this.companyRepository.save(companies);
    console.log(`✅ Seeded ${result.length} companies successfully.`);

    return result;
  }
}
