import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileController } from './files.controller';

import { MinioModule } from './minio/minio.module';
@Module({
  imports: [MinioModule],

  controllers: [FileController],
  providers: [FilesService],
})
export class FilesModule {}
