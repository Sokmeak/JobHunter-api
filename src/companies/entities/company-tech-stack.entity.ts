import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { Company } from './company.entity';
import { Technology } from './technology.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('company_tech_stacks')
export class CompanyTechStack extends BaseEntity {


  @PrimaryColumn()
  technology_id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Technology, { onDelete: 'CASCADE' })
  technology: Technology;
}