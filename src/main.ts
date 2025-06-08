import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { DataSource } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  log('\n🚀 Starting the application...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  log('🔧 Global validation pipe enabled');
  app.enableCors();

  const dataSource = app.get(DataSource);

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Successfully connected to PostgreSQ ');
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error('❌ Failed to connect to PostgreSQL:', error.message);
    process.exit(1);
  }

  log('🔧 CORS enabled for all origins');
  log('🎉 Application started successfully');
  log(`📡 Listening on port: ${process.env.PORT_BE ?? 3000}\n`);

  await app.listen(process.env.PORT_BE ?? 3000);
}
bootstrap();
