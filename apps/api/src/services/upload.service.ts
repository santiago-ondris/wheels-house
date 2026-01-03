import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class UploadService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadImage(filePath: string): Promise<string> {
        try {
            // Upload to Cloudinary with transformations
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'wheels-house/cars',
                transformation: [
                    { width: 1200, crop: 'limit' }, // Max width 1200px
                    { quality: 'auto' }, // Auto quality optimization
                    { fetch_format: 'auto' }, // Auto format (webp for modern browsers)
                ],
            });

            return result.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error('Failed to upload image to Cloudinary');
        }
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error:', error);
        }
    }
}
