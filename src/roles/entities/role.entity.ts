import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';
import { RoleENUM } from '../interface/roles.interface';
import { User } from 'src/users/entities/user.entity';
@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'enum', enum: RoleENUM })
  type: RoleENUM;
  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
