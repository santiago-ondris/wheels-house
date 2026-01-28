import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as crypto from 'crypto';

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  eager: string;
}

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME')!,
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY')!,
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET')!,
    });
  }

  /**
   * Genera una firma para subir imágenes directamente a Cloudinary.
   * La firma es válida por ~1 hora (basada en timestamp).
   */
  generateSignature(): CloudinarySignature {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'wheels-house/cars';
    const eager = 'w_1200,c_limit/q_auto/f_auto';
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET')!;

    const paramsToSign = `eager=${eager}&folder=${folder}&timestamp=${timestamp}`;

    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    return {
      signature,
      timestamp,
      cloudName: this.configService.get<string>('CLOUDINARY_CLOUD_NAME')!,
      apiKey: this.configService.get<string>('CLOUDINARY_API_KEY')!,
      folder,
      eager,
    };
  }

  async uploadImage(
    filePath: string,
  ): Promise<{ url: string; publicId: string }> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'wheels-house/cars',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
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
