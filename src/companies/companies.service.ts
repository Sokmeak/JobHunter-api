import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '../users/entities/user.entity';

import { plainToInstance } from 'class-transformer';
import { CompanyResponseDto } from './dto/company-response.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: createCompanyDto.userId,
    });

    if (!user) throw new NotFoundException('User not found');

    const existing = await this.companyRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existing) throw new ConflictException('User already has a company');

    const company = this.companyRepository.create({
      ...createCompanyDto,
      user,
    });

    const savedCompany = await this.companyRepository.save(company);

    return plainToInstance(CompanyResponseDto, {
      ...savedCompany,
      hr_contact: {
        name: user.username,
        email: user.email,
      },
    });
  }

  async findAll(): Promise<CompanyResponseDto[]> {
    const companies = await this.companyRepository.find({
      relations: ['user'],
    });

    return companies.map((company) =>
      plainToInstance(CompanyResponseDto, {
        ...company,
        hr_contact: {
          name: company.user?.username,
          email: company.user?.email,
        },
      }),
    );
  }

  async findOne(id: number): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found!`);
    }

    return plainToInstance(CompanyResponseDto, {
      ...company,
      hr_contact: {
        name: company.user?.username,
        email: company.user?.email,
      },
    });
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company not found');

    Object.assign(company, updateCompanyDto);

    const updatedCompany = await this.companyRepository.save(company);

    return plainToInstance(CompanyResponseDto, {
      ...updatedCompany,
      hr_contact: {
        name: updatedCompany.user?.username,
        email: updatedCompany.user?.email,
      },
    });
  }

  async remove(id: number): Promise<void> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) throw new NotFoundException('Company not found');

    await this.companyRepository.remove(company);
  }

  async findByUserId(userId: number): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!company) {
      throw new NotFoundException(
        `Company for user with id ${userId} not found!`,
      );
    }

    return plainToInstance(CompanyResponseDto, {
      ...company,
      hr_contact: {
        name: company.user?.username,
        email: company.user?.email,
      },
    });
  }
}
