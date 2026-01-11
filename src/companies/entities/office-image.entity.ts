import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { OfficeLocation } from './office-location.entity';
import { BaseEntity } from 'src/database/base.entity';

@Entity('office_images')
export class OfficeImage extends BaseEntity {


  @ManyToOne(() => OfficeLocation, location => location.images, { onDelete: 'CASCADE' })
  officeLocation: OfficeLocation;

  @Column()
  office_location_id: number;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'text', nullable: true })
  caption: string;

  @CreateDateColumn()
  created_at: Date;
}