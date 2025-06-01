import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RolesGuard } from './guards/role.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dts/login.dto';
import { AppModule } from 'src/app.module';
import { AuthenticationGuard } from './guards/authentication/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly usersService: UsersService) {}

  private logger = new Logger(AppModule.name);

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(AuthenticationGuard, RolesGuard)
  // logout need more implement more at the fronted
  @Post('logout')
  async logout(@Request() req) {
    this.logger.debug(`User ${req.user.email} logged out`);
    return { message: 'Successfully logged out' };
  }

  @UseGuards(AuthenticationGuard, RolesGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      userId: req.user.id,
      email: req.user.email,
      role: req.user.role_id === 1 ? 'freelancer' : 'admin',
    };
  }
}
