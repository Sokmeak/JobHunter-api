import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';
@Entity('tests')
export class Test extends BaseEntity {
  @Column()
  testname: string;
  @Column()
  status: boolean;
}
