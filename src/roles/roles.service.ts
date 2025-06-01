import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleResponseDto } from './dto/role-response.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    @InjectRepository(User)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // check if the role already exists
    const existingRole = await this.roleRepository.findOne({
      where: { type: createRoleDto.type },
    });
    if (existingRole) {
      throw new Error(`Role with type ${createRoleDto.type} already exists`);
    }
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find({ relations: ['users'] });
    if (!roles || roles.length === 0) {
      return [];
    }
    return roles.map((role) => this.toRoleResponse(role));
  }

  async findOne(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!role) {
      throw new Error(`Role with id ${id} not found`);
    }
    return this.toRoleResponse(role);
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error(`Role with id ${id} not found`);
    }
    // Update the role with the new data
    Object.assign(role, updateRoleDto);
    const updatedRole = await this.roleRepository.save(role);
    return this.toRoleResponse(updatedRole);
  }

  async remove(id: number): Promise<Object> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    await this.roleRepository.delete(id);
    return {
      message: `Role with id ${id} successfully deleted`,
      deletedRoleID: role.id,
      status: 200,
    };
  }

  private toRoleResponse(role: Role): RoleResponseDto {
    return {
      id: role.id,
      type: role.type,
      users: role.users?.map((user) => user.username) || [],
    };
  }
}
