export declare class UploadService {
    private readonly uploadDir;
    private readonly maxFileSize;
    private readonly allowedImageTypes;
    private readonly allowedDocumentTypes;
    uploadImage(file: Express.Multer.File): Promise<string>;
    uploadDocument(file: Express.Multer.File): Promise<string>;
    private saveFile;
    uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]>;
}
