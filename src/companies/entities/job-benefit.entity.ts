import { Entity, Column,  ManyToOne } from 'typeorm';
import { Company } from './company.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('job_benefits')
export class JobBenefit  extends BaseEntity{


  @ManyToOne(() => Company, company => company.benefits, { onDelete: 'CASCADE' })
  company: Company;

  @Column()
  company_id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @Column({ default: true })
  is_active: boolean;
}
