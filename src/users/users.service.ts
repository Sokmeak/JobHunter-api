import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if role exists
    const role = await this.roleRepo.findOne({
      where: { id: createUserDto.roleId },
    });
    // in case we call this service without roleId
    if (!role) {
      throw new NotFoundException(
        `Role with id ${createUserDto.roleId} does not exist`,
      );
    }

    // Check if a user with the same email and role already exists
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email, roleId: createUserDto.roleId },
    });
    if (existingUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} and roleId ${createUserDto.roleId} already exists`,
      );
    }

    // Hash the password if needed
    // For simplicity, assuming password is already hashed in CreateUserDto
    // If you need to hash the password, you can use bcrypt or any other library here
    // Example: createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    // Create a new user instance
    // Ensure the roleId is set correctly
    createUserDto.roleId = role.id; // Ensure roleId is set to the existing role's id
    // Create a new user entity 
      
  






    const user = this.userRepo.create(createUserDto);

    // Reload with role relation

    // Save the new user
    const savedUser = await this.userRepo.save(user);

    const userWithRole = await this.userRepo.findOne({
      where: { id: savedUser.id },
      relations: ['role'],
    });
    return this.toResponse(userWithRole!);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // If roleId is being updated, check if the role exists
    if (updateUserDto.roleId) {
      const role = await this.roleRepo.findOne({
        where: { id: updateUserDto.roleId },
      });
      if (!role) {
        throw new BadRequestException(
          `Role with id ${updateUserDto.roleId} does not exist`,
        );
      }
    }

    // Update user
    await this.userRepo.update(id, updateUserDto);

    // Fetch the updated user
    const updated = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!updated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.toResponse(updated);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find({ relations: ['role'] });
    return users.map((user) => this.toResponse(user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.toResponse(user);
  }

  async remove(
    id: number,
  ): Promise<{ message: string; deletedUser: User; status: number }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepo.delete(id);
    return {
      message: `User with id ${id} successfully deleted`,
      deletedUser: user,
      status: 200,
    };
  }

  public toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      role: user.role?.type ?? 'Unknown',
      createdAt: user.createdAt,
    };
  }
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email }, // Find user by email
      relations: ['role'], // Include role relation
    });
    return user || null; // Return user or null if not found
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(
        `User with email ${email} not found or invalid credentials`,
      );
    }

    // If you want to return the user without the password
    // make some validation here
    if (user.password !== password) {
      throw new BadRequestException('Invalid password');
    }
    // Optionally, you can remove the password field before returning

    // Return the user object without the password

    return user;
  }
}
