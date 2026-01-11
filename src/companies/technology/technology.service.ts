import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technology } from './technology.entity';
import { CreateTechnologyDto } from './dto/create-tech.dto';

@Injectable()
export class TechnologyService {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  async create(dto: CreateTechnologyDto): Promise<Technology> {
    const tech = this.technologyRepository.create(dto);
    return this.technologyRepository.save(tech);
  }

  async findAll(): Promise<Technology[]> {
    return this.technologyRepository.find();
  }

  async findOne(id: number): Promise<Technology> {
    const tech = await this.technologyRepository.findOne({ where: { id } });
    if (!tech) throw new NotFoundException(`Technology #${id} not found`);
    return tech;
  }

  async remove(id: number): Promise<void> {
    const tech = await this.findOne(id);
    await this.technologyRepository.remove(tech);
  }
}
