import { Entity, Column,  ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Company } from './company.entity';
import { OfficeImage } from './office-image.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('office_locations')
export class OfficeLocation  extends BaseEntity{
 

  @ManyToOne(() => Company, company => company.officeLocations, { onDelete: 'CASCADE' })
  company: Company;

  @Column()
  company_id: number;

  @Column({ length: 100 })
  country: string;

  @Column({ default: false })
  is_headquarters: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OfficeImage, image => image.officeLocation, { cascade: true })
  images: OfficeImage[];
}