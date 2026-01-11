import { User } from 'src/users/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';

@Entity('notifications')
export class Notification extends BaseEntity {


  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  user_id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;
}
