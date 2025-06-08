import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { FilesModule } from './files/files.module';
import { JobseekersModule } from './jobseekers/jobseekers.module';

@Module({
  // Importing ConfigModule to manage environment variables
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
      envFilePath: '.env', // Path to the environment file
    }),
    UsersModule,
    RolesModule,
    forwardRef(() => AuthModule),
    CompaniesModule,
    FilesModule,
    JobseekersModule, // Forward reference to AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
