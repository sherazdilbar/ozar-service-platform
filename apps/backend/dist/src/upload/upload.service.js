"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fs_1 = require("fs");
let UploadService = class UploadService {
    constructor() {
        this.uploadDir = (0, path_1.join)(process.cwd(), 'uploads');
        this.maxFileSize = 10 * 1024 * 1024;
        this.allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        this.allowedDocumentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
        ];
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!this.allowedImageTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only JPEG, PNG, WebP, and GIF images are allowed');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException('File size must be less than 10MB');
        }
        return this.saveFile(file, 'images');
    }
    async uploadDocument(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!this.allowedDocumentTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only PDF, Word, Excel, and text files are allowed');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException('File size must be less than 10MB');
        }
        return this.saveFile(file, 'documents');
    }
    async saveFile(file, subfolder) {
        const targetDir = (0, path_1.join)(this.uploadDir, subfolder);
        if (!(0, fs_1.existsSync)(targetDir)) {
            await (0, promises_1.mkdir)(targetDir, { recursive: true });
        }
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const extension = file.originalname.split('.').pop();
        const filename = `${timestamp}-${randomString}.${extension}`;
        const filepath = (0, path_1.join)(targetDir, filename);
        await (0, promises_1.writeFile)(filepath, file.buffer);
        return `/uploads/${subfolder}/${filename}`;
    }
    async uploadMultipleImages(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        if (files.length > 10) {
            throw new common_1.BadRequestException('Maximum 10 files allowed');
        }
        const uploadPromises = files.map(file => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map