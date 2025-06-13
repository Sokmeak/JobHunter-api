import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';

@Entity('technologies')
export class Technology extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;
}
