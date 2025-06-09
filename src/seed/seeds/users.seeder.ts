import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

export class UsersSeeder {
  constructor(
    private readonly userRepo: Repository<User>,
    private readonly roles: Role[],
  ) {}

  async run() {
    await this.userRepo.clear();
    const password = '123456';
    const hashedPassword = await this.hashPassword('123456');

    const users: Partial<User>[] = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: this.roles[0],
      },
      {
        username: 'jane_doe',
        email: 'jane@example.com',
        password: hashedPassword,
        role: this.roles[1],
      },
      {
        username: 'joke_doe',
        email: 'joke@example.com',
        password: hashedPassword,
        role: this.roles[1],
      },
      {
        username: 'heng_ratha',
        email: 'ratha@example.com',
        password: hashedPassword,
        role: this.roles[2],
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
