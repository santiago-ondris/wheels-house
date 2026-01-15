import {
    Controller,
    Post,
    Get,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Delete,
    Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../validators/auth.validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from '../services/upload.service';
import type { CloudinarySignature } from '../services/upload.service';
import * as fs from 'fs';
import * as path from 'path';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    // Get a signature for direct frontend uploads to Cloudinary.
    @UseGuards(JwtAuthGuard)
    @Get('signature')
    getSignature(): CloudinarySignature {
        return this.uploadService.generateSignature();
    }

    @UseGuards(JwtAuthGuard)
    @UseGuards(ThrottlerGuard)
    @Post('image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/temp',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = path.extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
            fileFilter: (req, file, cb) => {
                const allowedMimes = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'image/heic',
                    'image/heif'
                ];
                if (allowedMimes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException('Solo se permiten imágenes (JPG, PNG, GIF, WEBP, HEIC)'), false);
                }
            },
        })
    )
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            const data = await this.uploadService.uploadImage(file.path);

            fs.unlinkSync(file.path);

            return {
                success: true,
                url: data.url,
                publicId: data.publicId,
            };
        } catch (error) {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    }

    @UseGuards(ThrottlerGuard)
    @Post('image/public')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/temp',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = path.extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
            fileFilter: (req, file, cb) => {
                const allowedMimes = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'image/heic',
                    'image/heif'
                ];
                if (allowedMimes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException('Solo se permiten imágenes (JPG, PNG, GIF, WEBP, HEIC)'), false);
                }
            },
        })
    )
    async uploadImagePublic(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            const data = await this.uploadService.uploadImage(file.path);

            fs.unlinkSync(file.path);

            return {
                success: true,
                url: data.url,
                publicId: data.publicId,
            };
        } catch (error) {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('image/:publicId')
    async deleteImage(@Param('publicId') publicId: string) {
        if (!publicId) {
            throw new BadRequestException('Public ID is required');
        }

        try {
            await this.uploadService.deleteImage(publicId);
            return {
                success: true,
                message: 'Image deleted successfully',
            };
        } catch (error) {
            throw new BadRequestException('Failed to delete image');
        }
    }
}
