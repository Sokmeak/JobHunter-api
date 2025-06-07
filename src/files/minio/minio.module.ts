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
          endPoint: 'localhost',
          port: 9000,
          useSSL: false,
          accessKey: 'RGSm91Drl6VqD2Nk',
          secretKey: 'vYE0JunvdKN2jSF4wpwG4FkvAmSB4YZt',
        });
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [MINIO_CLIENT],
})
export class MinioModule {}
