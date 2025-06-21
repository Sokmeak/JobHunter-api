import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { RoleENUM } from 'src/roles/interface/roles.interface';

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
      // 44 EMPLOYER users
      ...Array.from({ length: 44 }, (_, index) => ({
        username: `employer_${index + 1}`,
        email: `employer${index + 1}@example.com`,
        password: hashedPassword,
        role: employerRole,
      })),
      // 30 JOB SEEKER users
      ...Array.from({ length: 30 }, (_, index) => ({
        username: `jobseeker_${index + 1}`,
        email: `jobseeker${index + 1}@example.com`,
        password: hashedPassword,
        role: jobSeekerRole,
      })),
    ];

    const result = await this.userRepo.save(users);
    console.log(`✅ Seeded ${result.length} users successfully.`);

    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
