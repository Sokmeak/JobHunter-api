import { Repository } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { RoleENUM } from 'src/roles/interface/roles.interface';

export class RolesSeeder {
  constructor(
    private readonly roleRepo: Repository<Role>,
    private readonly userRepository: Repository<User>,
  ) {}

  async run() {
    try {
      // Delete users first to avoid FK constraint issues
      await this.userRepository.createQueryBuilder().delete().execute();

      // Then delete roles
      await this.roleRepo.createQueryBuilder().delete().execute();

      // Insert default roles
      const roles = Object.values(RoleENUM).map((type) => ({ type }));

      console.log('✅ Roles seeding completed.');
      return await this.roleRepo.save(roles);
    } catch (error) {
      console.error('❌ Roles seeding failed:', error);
      throw error;
    }
  }
}
