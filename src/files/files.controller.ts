import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import * as multer from 'multer';
import { Express } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // Store in memory for MinIO upload
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.uploadFile(file);
  }

  @Get('url/:fileName')
  async getFileUrl(@Param('fileName') fileName: string) {
    return { url: await this.fileService.getFileUrl(fileName) };
  }

  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    return await this.fileService.deleteFile(fileName);
  }
}
