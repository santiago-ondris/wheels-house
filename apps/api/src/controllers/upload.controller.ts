import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadService } from 'src/services/upload.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @UseGuards(AuthGuard('jwt'))
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
            const url = await this.uploadService.uploadImage(file.path);

            fs.unlinkSync(file.path);

            return {
                success: true,
                url: url,
            };
        } catch (error) {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    }
}
