// import { Entity, Column, OneToOne } from 'typeorm';
// import { User } from 'src/users/entities/user.entity';
// import { BaseEntity } from 'src/database/base.entity';
// @Entity('companies')
// export class Company extends BaseEntity {
//   @Column()
//   name: string;

//   @Column()
//   website_url: string;

//   @Column({ nullable: true })
//   founded_date: string;

//   @Column()
//   employee_count: string;

//   @Column({ nullable: true })
//   industry: string;

//   @Column({
//     nullable: true,
//   })
//   office_location: string;

//   @Column({ nullable: true })
//   twitter_url: string;

//   @Column({ nullable: true })
//   facebook_url: string;

//   @Column({ nullable: true })
//   linked_url: string;

//   @Column({ nullable: true })
//   email: string;

//   @Column({ nullable: true })
//   hr_contact_name: string;

//   @Column({ nullable: true })
//   hr_contact_email: string;

//   @Column({
//     nullable: true,
//   })
//   headquarters_location: string;

//   @Column({ default: true })
//   isActive: boolean;

//   @Column({ default: false })
//   isVerified: boolean;

//   @OneToOne(() => User, (user) => user.company)
//   user: User;
// }

// src/companies/entities/company.entity.ts
// src/companies/entities/company.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Member } from './member.entity';
import { Technology } from './technology.entity';
import { OfficeLocation } from './office-location.entity';
import { JobBenefit } from './job-benefit.entity';
import { CompanyDocument } from './company-document.entity';
import { Job } from './job.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  user_id: string;

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

  @OneToMany(() => Member, (member) => member.company, { cascade: true })
  members: Member[];

  @ManyToMany(() => Technology, { cascade: true })
  @JoinTable({ name: 'company_tech_stack' })
  technologies: Technology[];

  @OneToMany(() => OfficeLocation, (location) => location.company, {
    cascade: true,
  })
  officeLocations: OfficeLocation[];

  @Column({ type: 'text', nullable: true })
  companiesImages: string; // For company-level images (e.g., banner)

  @Column({ type: 'text', array: true, nullable: true, default: '{}' })
  officeImages: string[]; // Stores all office image URLs

  @OneToMany(() => JobBenefit, (benefit) => benefit.company, { cascade: true })
  benefits: JobBenefit[];

  @OneToMany(() => CompanyDocument, (document) => document.company, {
    cascade: true,
  })
  documents: CompanyDocument[];

  @OneToMany(() => Job, (job) => job.company, { cascade: true })
  jobs: Job[];
}
