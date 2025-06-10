import { Entity, Column, ManyToOne } from 'typeorm';
import { Company } from './company.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('company_documents')
export class CompanyDocument extends BaseEntity {
  @ManyToOne(() => Company, (company) => company.documents, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @Column()
  company_id: number;

  @Column({ length: 255 })
  document_name: string;

  @Column({ type: 'text' })
  document_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  upload_at: string;
}
