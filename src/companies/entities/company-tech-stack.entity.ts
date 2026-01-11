import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';
import { Company } from './company.entity';
import { Technology } from '../technology/technology.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('company_tech_stacks')
export class CompanyTechStack extends BaseEntity {
  @PrimaryColumn()
  company_id: number;

  @PrimaryColumn()
  technology_id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Technology, { onDelete: 'CASCADE' })
  technology: Technology;
}
