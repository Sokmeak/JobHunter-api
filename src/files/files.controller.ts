import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import * as multer from 'multer';
import { Express } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return await this.filesService.uploadFile(file);
  }

  @Get('url/:fileName')
  async getFileUrl(
    @Param('fileName') fileName: string,
    @Query('type') type: 'original' | 'thumbnail' = 'original',
  ) {
    return { url: await this.filesService.getFileUrl(fileName, type) };
  }

  @Get('image/:fileName')
  async getFileImage(
    @Param('fileName') fileName: string,
    @Query('type') type: 'original' | 'thumbnail' = 'original',
  ) {
    const { stream, contentType } = await this.filesService.getFileStream(
      fileName,
      type,
    );
    return new StreamableFile(stream, { type: contentType });
  }

  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    return await this.filesService.deleteFile(fileName);
  }

  @Get('test-connection')
  async testConnection() {
    return await this.filesService.testConnection();
  }
}
