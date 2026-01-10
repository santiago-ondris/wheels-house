import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME')!,
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY')!,
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET')!,
    });
  }

  async uploadImage(
    filePath: string,
  ): Promise<{ url: string; publicId: string }> {
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

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
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
