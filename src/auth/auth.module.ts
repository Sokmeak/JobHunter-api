import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy'; // correct path
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CompaniesService } from 'src/companies/companies.service';

import { Reflector } from '@nestjs/core';
import { BcryptProvider } from 'src/users/bcrypt.provider';
import { RolesService } from 'src/roles/roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity'; // Ensure this path is correct
import { Company } from 'src/companies/entities/company.entity';
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Role, Company]), // This makes RoleRepository available
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    CompaniesService,
    AuthService,
    JwtStrategy,
    Reflector,
    JwtService,
    BcryptProvider,
    RolesService,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
