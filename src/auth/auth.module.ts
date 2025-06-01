import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy'; // correct path
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';


import { Reflector } from '@nestjs/core';
@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Reflector, JwtService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
