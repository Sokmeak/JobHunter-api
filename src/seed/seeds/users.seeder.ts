import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { RoleENUM } from 'src/roles/interface/roles.interface';

// UsersSeeder (updated for 10 EMPLOYER and 10 JOB SEEKER users)
export class UsersSeeder {
  constructor(
    private readonly userRepo: Repository<User>,
    private readonly roles: Role[],
  ) {}

  async run() {
    // Find EMPLOYER and JOB SEEKER roles
    const employerRole = this.roles.find(
      (role) => role.type === RoleENUM.EMPLOYER,
    );
    const jobSeekerRole = this.roles.find(
      (role) => role.type === RoleENUM.APPLICANT,
    );
    if (!employerRole || !jobSeekerRole) {
      throw new Error('Required roles (EMPLOYER or JOB SEEKER) not found');
    }

    const password = '123456';
    const hashedPassword = await this.hashPassword(password);

    const users: Partial<User>[] = [
      // 10 EMPLOYER users
      {
        username: 'employer_1',
        email: 'employer1@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      {
        username: 'employer_2',
        email: 'employer2@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      {
        username: 'employer_3',
        email: 'employer3@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      {
        username: 'employer_4',
        email: 'employer4@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      {
        username: 'employer_5',
        email: 'employer5@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      {
        username: 'employer_6',
        email: 'employer6@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      {
        username: 'employer_7',
        email: 'employer7@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      {
        username: 'employer_8',
        email: 'employer8@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      {
        username: 'employer_9',
        email: 'employer9@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      {
        username: 'employer_10',
        email: 'employer10@example.com',
        password: hashedPassword,
        role: employerRole,
      },
      // 10 JOB SEEKER users
      {
        username: 'jobseeker_1',
        email: 'jobseeker1@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
      {
        username: 'jobseeker_2',
        email: 'jobseeker2@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
      {
        username: 'jobseeker_3',
        email: 'jobseeker3@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
      {
        username: 'jobseeker_4',
        email: 'jobseeker4@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
      {
        username: 'jobseeker_5',
        email: 'jobseeker5@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
      {
        username: 'jobseeker_6',
        email: 'jobseeker6@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
      {
        username: 'jobseeker_7',
        email: 'jobseeker7@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
      {
        username: 'jobseeker_8',
        email: 'jobseeker8@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
      {
        username: 'jobseeker_9',
        email: 'jobseeker9@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
      {
        username: 'jobseeker_10',
        email: 'jobseeker10@example.com',
        password: hashedPassword,
        role: jobSeekerRole,
      },
    ];

    const result = await this.userRepo.save(users);
    console.log(`✅ Seeded ${result.length} users successfully.`);

    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
