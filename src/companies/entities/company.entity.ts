import { Entity, Column, OneToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/database/base.entity';
@Entity('companies')
export class Company extends BaseEntity {
  @Column()
  name: string;

  @Column()
  website_url: string;

  @Column({ nullable: true })
  founded_date: string;

  @Column()
  employee_count: string;

  @Column({ nullable: true })
  industry: string;

  @Column({
    nullable: true,
  })
  office_location: string;

  @Column({ nullable: true })
  twitter_url: string;

  @Column({ nullable: true })
  facebook_url: string;

  @Column({ nullable: true })
  linked_url: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  hr_contact_name: string;

  @Column({ nullable: true })
  hr_contact_email: string;

  @Column({
    nullable: true,
  })
  headquarters_location: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @OneToOne(() => User, (user) => user.company)
  user: User;
}


