import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { CreateTechnologyDto } from './dto/create-tech.dto';

@Controller('technologies')
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Post()
  create(@Body() dto: CreateTechnologyDto) {
    return this.technologyService.create(dto);
  }

  @Get()
  findAll() {
    return this.technologyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.technologyService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.technologyService.remove(+id);
  }
}
