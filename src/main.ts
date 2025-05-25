import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  log('\n🚀 Starting the application...');
  app.enableCors();



  app.setGlobalPrefix('api');
  log('🔧 CORS enabled for all origins');
  log('🌐 Global prefix set to /api');
  log('🎉 Application started successfully');
  log(`📡 Listening on port: ${process.env.PORT_BE ?? 3000}\n`);

  await app.listen(process.env.PORT_BE ?? 3000);
}
bootstrap();
