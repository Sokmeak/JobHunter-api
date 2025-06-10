import { BaseEntity } from 'src/database/base.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity('notifications-applicant')
export class Notification extends BaseEntity{


  @ManyToOne(() => User, (user) => user.notifications,{ nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => Role, { nullable: true, onDelete: 'CASCADE' })
  role: Role;

  @Column({ nullable: true })
  role_id: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
