import {
  Entity,
  Column,
  OneToOne,
  Unique,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { BaseEntity } from 'src/database/base.entity';
import { Company } from 'src/companies/entities/company.entity';

import { Notification } from 'src/jobseekers/entities/notification.entity';

@Entity('users')
@Unique(['roleId', 'email']) // Unique email per role
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToOne(() => Company, (company) => company.user)
  @JoinColumn()
  company: Company;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
