import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/database/base.entity';
import { CompanyTechStack } from '../entities/company-tech-stack.entity';

@Entity('technologies')
export class Technology extends BaseEntity {
  @Column({ length: 100, unique: true })
  name: string;

  @OneToMany(() => CompanyTechStack, (techStack) => techStack.technology)
  techStacks: CompanyTechStack[];
}
