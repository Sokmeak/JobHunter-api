import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
export const MINIO_CLIENT = 'MINIO_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MINIO_CLIENT,
      useFactory: () => {
        const client = new Minio.Client({
          endPoint: 'minio',
          port: 9000,
          useSSL: false,
          accessKey: 'BD4R5vfrR8C36xSeOuC1',
          secretKey: 'CD5dju2VQM2IQoXDoqN1sk0uX1LLeW8JfycpFrEM',
        });
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [MINIO_CLIENT],
})
export class MinioModule {}
