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
import { BcryptProvider } from 'src/users/bcrypt.provider';
import { CompaniesService } from 'src/companies/companies.service';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { stringify } from 'querystring';
import { CreateJobSeekerDto } from 'src/jobseekers/dto/create-jobseeker.dto';
import { JobSeekersService } from 'src/jobseekers/jobseekers.service';
// import { Role } from 'src/roles/entities/role.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private roleService: RolesService,
    private bcryptProvider: BcryptProvider,
    private companyService: CompaniesService,
    private jobSeekerService: JobSeekersService,
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

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
      }),
      message: 'ready to go !!!',
    };
  }

  async signup(userDto: SignupDto): Promise<{ message: string }> {
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
      // hashing the password
      password: await this.bcryptProvider.hashPassword(userDto.password),
      username: userDto.username,
      roleId: role.id,
    };
    console.log('userDtoWithRole', userDtoWithRole);

    const user = await this.userService.create(userDtoWithRole);

    // Assume you already have a `user` object after user creation
    if (userDto.role === 'JOB SEEKER') {
      const jobSeekerData: CreateJobSeekerDto = {
        user_id: user.id,
        jobseeker_email: user.email,
        jobseeker_name: user.username,
        profile_image: '', // or null / undefined (optional)
        headline: 'Aspiring professional seeking new opportunities',
        bio: 'I am a passionate individual looking to grow in a dynamic company.',
        current_status: 'Open to work',
        preferred_location: 'Phnom Penh',
        expected_salary: 500, // or leave it undefined if not known
      };

      console.log('jobSeekerData', jobSeekerData);

      // Example: save to database using your service
      await this.jobSeekerService.createJobSeeker(user.id, jobSeekerData);
    }

    // If employer, create company
    if (userDto.role === 'EMPLOYER') {
      const companyData: CreateCompanyDto = {
        user_id: user.id,
        culture_description: '',
        name: userDto.companyName,
        employee_count: String(userDto.companySize), // ensure string
        email: '', // should be a valid email, not website
        website_url: userDto.websiteUrl || '',
        // Optional fields, add if available in userDto
        hr_contact_name: userDto.username,
        hr_contact_email: user.email,
        founded_date: '',
        industry: '',
        office_location: '',
        twitter_url: '',
        facebook_url: '',
        linkedin_url: '',
        headquarters_location: '',
        isActive: true,
        isVerified: false,
        brand_logo: '',
      };
      await this.companyService.createCompany(String(user.id), companyData);
    }

    // // Generate JWT
    // const payload = { sub: user.id, email: user.email, role: userDto.role };
    // const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Signup successfully!',
    };
  }
}

//access_token: await this.jwtService.signAsync(payload),

//const payload = { email: user.email, sub: user.id, role_id: user.role_id };
