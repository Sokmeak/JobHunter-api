import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient = new Minio.Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'BD4R5vfrR8C36xSeOuC1',
    secretKey: 'CD5dju2VQM2IQoXDoqN1sk0uX1LLeW8JfycpFrEM',
  });

  async uploadFile(file: Express.Multer.File) {
    const bucketName = 'my-bucket';
    const fileName = Date.now() + '-' + file.originalname;

    // Ensure bucket exists
    const exists = await this.minioClient.bucketExists(bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(bucketName);
    }

    // Upload the file using the buffer from memory
    await this.minioClient.putObject(bucketName, fileName, file.buffer);

    return { message: 'File uploaded', fileName };
  }
}
