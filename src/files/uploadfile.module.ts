import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileController } from './files.controller';
import { MinioModule } from './minio/minio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MinioModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [FileController],
  providers: [FilesService],
})
export class FileModule {}
