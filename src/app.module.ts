import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  // Importing ConfigModule to manage environment variables
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available
      envFilePath: '.env', // Path to the environment file
      ignoreEnvFile: false, // Do not ignore the .env file
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
