import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { MINIO_CLIENT } from './minio/minio.module';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  private readonly bucketName: string;

  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Minio.Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow('MINIO_BUCKET_NAME');
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
    }
  }

  async uploadFile(file: Express.Multer.File) {
    await this.createBucketIfNotExists();
    const fileName = `${randomUUID()}-${file.originalname}`;
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return {
      fileName,
      originalName: file.originalname,
      size: file.size,
    };
  }

  async getFileUrl(fileName: string) {
    return await this.minioClient.presignedUrl('GET', this.bucketName, fileName, 24 * 60 * 60); // URL valid for 24 hours
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
    return { message: `File ${fileName} deleted successfully` };
  }
}
