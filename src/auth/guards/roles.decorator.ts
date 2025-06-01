// auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/roles/entities/role.entity';
import { RoleENUM } from '../../roles/interface/roles.interface';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleENUM[]) => SetMetadata(ROLES_KEY, roles);
