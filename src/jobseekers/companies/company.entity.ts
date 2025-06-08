// company.entity.ts (assumed for reference)
import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';

@Entity('companies')
export class Company extends BaseEntity  {

  @Column()
  name: string;

  @Column()
  industry: string;

  @Column('text', { nullable: true })
  reviews: string; // JSON or text containing reviews
}
