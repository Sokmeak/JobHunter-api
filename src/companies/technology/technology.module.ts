import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from './technology.entity';
import { TechnologyService } from './technology.service';
import { TechnologyController } from './technology.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  controllers: [TechnologyController],
  providers: [TechnologyService],
})
export class TechnologyModule {}
