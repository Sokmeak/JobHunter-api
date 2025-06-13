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
      useFactory: async (configService: ConfigService) => {
        const client = new Minio.Client({
          endPoint: configService.getOrThrow('MINIO_ENDPOINT'),
          port: +configService.getOrThrow('MINIO_PORT'),
          useSSL: configService.getOrThrow('MINIO_USE_SSL') === 'true',
          accessKey: configService.getOrThrow('MINIO_ACCESS_KEY'),
          secretKey: configService.getOrThrow('MINIO_SECRET_KEY'),
        });
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [MINIO_CLIENT],
})
export class MinioModule {}
