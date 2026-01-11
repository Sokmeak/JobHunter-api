import { RoleENUM } from '../interface/roles.interface';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsEnum(RoleENUM, { message: 'Invalid role type' })
  @IsNotEmpty()
  type: RoleENUM;

  @IsString()
  @IsOptional()
  description?: string;
}
