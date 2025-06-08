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
          endPoint: 'minio',
          port: 9000,
          useSSL: false,
          accessKey: 'XFDRxox6ZFGHJypb',
          secretKey: 'WRDtuJzSFN6TulNmrAUt0VZiNGffD6T0',
        });
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [MINIO_CLIENT],
})
export class MinioModule {}
