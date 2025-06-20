import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { Member } from './member.entity';
import { Technology } from '../technology/technology.entity';
import { OfficeLocation } from './office-location.entity';
import { CompanyDocument } from './company-document.entity';
import { Job } from './job.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/database/base.entity';
import { CompanyTechStack } from './company-tech-stack.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  website_url: string;

  @Column({ type: 'text', nullable: true })
  founded_date: string;

  @Column({ type: 'varchar', nullable: true })
  employee_count: string;

  @Column({ length: 255, nullable: true })
  industry: string;

  @Column({ type: 'text', nullable: true })
  culture_description: string;

  @Column({ type: 'text', nullable: true })
  brand_logo: string;

  @Column({ type: 'text', nullable: true })
  twitter_url: string;

  @Column({ type: 'text', nullable: true })
  facebook_url: string;

  @Column({ type: 'text', nullable: true })
  linkedin_url: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  hr_contact_name: string;

  @Column({ type: 'text', nullable: true })
  hr_contact_email: string;

  @Column({ type: 'text', nullable: true })
  headquarters_location: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Member, (member) => member.company, {
    cascade: true,
    eager: true,
  })
  members: Member[];

  // @ManyToMany(() => Technology, { cascade: true })
  // technologies: Technology[];

  // company.entity.ts
  @OneToMany(() => CompanyTechStack, (techStack) => techStack.company)
  techStacks: CompanyTechStack[];

  @OneToMany(() => OfficeLocation, (location) => location.company, {
    cascade: true,
  })
  officeLocations: OfficeLocation[];



  @Column({ type: 'text', array: true, nullable: true, default: '{}' })
  officeImages: string[]; // Stores all office image URLs

  @OneToMany(() => CompanyDocument, (document) => document.company, {
    cascade: true,
  })
  documents: CompanyDocument[];

  @OneToMany(() => Job, (job) => job.company, { cascade: true })
  jobs: Job[];
}


