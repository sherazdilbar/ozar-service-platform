import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  private readonly allowedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  async uploadImage(file: Express.Multer.File): Promise<string> {
    // Validate file
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size must be less than 10MB');
    }

    return this.saveFile(file, 'images');
  }

  async uploadDocument(file: Express.Multer.File): Promise<string> {
    // Validate file
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedDocumentTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF, Word, Excel, and text files are allowed');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size must be less than 10MB');
    }

    return this.saveFile(file, 'documents');
  }

  private async saveFile(file: Express.Multer.File, subfolder: string): Promise<string> {
    // Ensure upload directory exists
    const targetDir = join(this.uploadDir, subfolder);
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.originalname.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    const filepath = join(targetDir, filename);

    // Save file
    await writeFile(filepath, file.buffer);

    // Return relative URL path (will be served by static file middleware)
    return `/uploads/${subfolder}/${filename}`;
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum 10 files allowed');
    }

    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
}
