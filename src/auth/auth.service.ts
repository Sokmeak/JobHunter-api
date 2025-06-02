import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RoleENUM } from 'src/roles/interface/roles.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { log } from 'console';
import { LoginDto } from './dts/login.dto';
import { Logger } from '@nestjs/common';

import { AppModule } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dts/signup.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private roleService: RolesService,
  ) {}

  logger = new Logger(AppModule.name);
  // auth/auth.service.ts
  async login({
    email,
    password,
  }: LoginDto): Promise<{ access_token: string; message }> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const payload = { email: user.email, sub: user.id, role_id: user.role_id };
    // this.logger.debug(`Login payload for ${email}: ${JSON.stringify(payload)}`);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    log(payload);

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
      }),
      message: 'ready to go !!!',
    };
  }

  async signup(userDto: SignupDto): Promise<{ message }> {
    // Check if user already exists
    const existingUser = await this.userService.findOneByEmail(userDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    // Create user
    const role = await this.roleService.findRoleByName(userDto.role);
    if (!role) {
      throw new BadRequestException(`Role ${userDto.role} does not exist`);
    }
    const userDtoWithRole: CreateUserDto = {
      email: userDto.email,
      password: userDto.password, // Ensure password is hashed in the service
      username: userDto.username,
      roleId: role.id,
     
    };
    const user = await this.userService.create(userDtoWithRole);
    // Generate JWT

    return {
      message: 'sigup successfully!',
    };
  }
}

//access_token: await this.jwtService.signAsync(payload),

//const payload = { email: user.email, sub: user.id, role_id: user.role_id };
