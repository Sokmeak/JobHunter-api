import { Entity, Column, ManyToOne } from 'typeorm';
import { Company } from './company.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('members')
export class Member extends BaseEntity {
 

  @ManyToOne(() => Company, company => company.members, { onDelete: 'CASCADE' })
  company: Company;

  @Column()
  company_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  position: string;

  @Column({ type: 'text', nullable: true })
  profile_img_url: string;

  @Column({ type: 'text', nullable: true })
  insta_url: string;

  @Column({ type: 'text', nullable: true })
  linked_url: string;
}