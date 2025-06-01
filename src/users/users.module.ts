import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { RolesModule } from 'src/roles/roles.module'; // Importing RolesModule to ensure Role entity is available

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule], // Importing TypeOrmModule with User entity and RolesModule for Role entity
  controllers: [UsersController],
  providers: [UsersService], // Providing UsersService and RolesService for dependency injection
  exports: [UsersService, TypeOrmModule], // Exporting UsersService for use in other modules
})
export class UsersModule {}
