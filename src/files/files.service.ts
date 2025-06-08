import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { MINIO_CLIENT } from './minio/minio.module';
import { randomUUID } from 'crypto';
import * as sharp from 'sharp';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  private readonly bucketName: string;
  private readonly originalPrefix = 'originals/';
  private readonly thumbnailPrefix = 'thumbnails/';

  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Minio.Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow('MINIO_BUCKET_NAME');
  }

  async createBucketIfNotExists() {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        console.log(`Bucket ${this.bucketName} created successfully`);
      }
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw new Error(`Failed to initialize bucket: ${error.message}`);
    }
  }

  async uploadFile(file: Express.Multer.File) {
    await this.createBucketIfNotExists();

    const fileName = `${randomUUID()}-${file.originalname}`;
    const originalPath = `${this.originalPrefix}${fileName}`;
    const thumbnailPath = `${this.thumbnailPrefix}${fileName}`;

    // Upload original file
    await this.minioClient.putObject(
      this.bucketName,
      originalPath,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );

    // Generate and upload thumbnail (resize to 200x200 as an example)
    try {
      const thumbnailBuffer = await sharp(file.buffer)
        .resize({ width: 200, height: 200, fit: 'inside' })
        .toBuffer();

      await this.minioClient.putObject(
        this.bucketName,
        thumbnailPath,
        thumbnailBuffer,
        thumbnailBuffer.length,
        { 'Content-Type': file.mimetype },
      );
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      await this.minioClient.removeObject(this.bucketName, originalPath);
      throw new Error(`Thumbnail generation failed: ${error.message}`);
    }

    return {
      fileName,
      originalName: file.originalname,
      size: file.size,
      originalPath,
      thumbnailPath,
    };
  }

  async getFileUrl(
    fileName: string,
    type: 'original' | 'thumbnail' = 'original',
  ) {
    const prefix =
      type === 'original' ? this.originalPrefix : this.thumbnailPrefix;
    const objectPath = `${prefix}${fileName}`;
    try {
      return await this.minioClient.presignedUrl(
        'GET',
        this.bucketName,
        objectPath,
        24 * 60 * 60,
      );
    } catch (error) {
      console.error(`Error generating presigned URL for ${objectPath}:`, error);
      throw new Error(`Failed to get URL: ${error.message}`);
    }
  }

  async getFileStream(
    fileName: string,
    type: 'original' | 'thumbnail' = 'original',
  ): Promise<{
    stream: Readable;
    contentType: string;
  }> {
    const prefix =
      type === 'original' ? this.originalPrefix : this.thumbnailPrefix;
    const objectPath = `${prefix}${fileName}`;
    try {
      const object = await this.minioClient.getObject(
        this.bucketName,
        objectPath,
      );
      const stat = await this.minioClient.statObject(
        this.bucketName,
        objectPath,
      );
      const contentType =
        stat.metaData['content-type'] || 'application/octet-stream';
      return { stream: object, contentType };
    } catch (error) {
      console.error(`Error fetching file ${objectPath}:`, error);
      throw new Error(`Failed to fetch file: ${error.message}`);
    }
  }

  async deleteFile(fileName: string) {
    try {
      await Promise.all([
        this.minioClient.removeObject(
          this.bucketName,
          `${this.originalPrefix}${fileName}`,
        ),
        this.minioClient.removeObject(
          this.bucketName,
          `${this.thumbnailPrefix}${fileName}`,
        ),
      ]);
      return {
        message: `File ${fileName} (original and thumbnail) deleted successfully`,
      };
    } catch (error) {
      console.error('Error deleting files:', error);
      throw new Error(`Failed to delete files: ${error.message}`);
    }
  }

  async testConnection(): Promise<string> {
    try {
      await this.minioClient.listBuckets();
      return 'MinIO connection successful';
    } catch (error) {
      throw new Error(`MinIO connection failed: ${error.message}`);
    }
  }
}
