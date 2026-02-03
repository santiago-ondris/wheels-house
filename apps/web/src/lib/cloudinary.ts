/**
 * Cloudinary URL Optimization Helper
 * 
 * This utility helps generate optimized Cloudinary URLs by injecting transformation parameters
 * such as format (f_auto), quality (q_auto), and dimensions.
 */

export type ImagePreset =
    | 'thumbnail'      // Very small (e.g., 64x64)
    | 'avatar'         // User avatar (e.g., 100x100)
    | 'avatar-lg'      // Large avatar (e.g., 200x200)
    | 'card'           // Grid card (e.g., 400px width)
    | 'card-lg'        // Large card (e.g., 800px width)
    | 'detail'         // Detail view (e.g., 1200px width)
    | 'fullscreen';    // Fullscreen view (e.g., 1920px width)

interface CloudinaryOptions {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
}

const PRESETS: Record<ImagePreset, CloudinaryOptions> = {
    'thumbnail': { width: 64, height: 64, crop: 'fill' },
    'avatar': { width: 100, height: 100, crop: 'fill' },
    'avatar-lg': { width: 200, height: 200, crop: 'fill' },
    'card': { width: 400, crop: 'limit' },
    'card-lg': { width: 800, crop: 'limit' },
    'detail': { width: 1200, crop: 'limit' },
    'fullscreen': { width: 1920, crop: 'limit' }
};

/**
 * Generates an optimized Cloudinary URL based on a preset or custom options.
 */
export function getOptimizedUrl(url: string | undefined | null, preset: ImagePreset = 'card'): string {
    if (!url) return '';

    // If not a Cloudinary URL, return as is
    if (!url.includes('cloudinary.com')) return url;

    // Simple optimization injection
    try {
        const parts = url.split('/upload/');
        if (parts.length !== 2) return url;

        const [baseUrl, path] = parts;
        const options = PRESETS[preset];

        // Construct transformation string
        const transformations: string[] = [
            'f_auto',       // Auto format (webp, avif, etc.)
            'q_auto',       // Auto quality
        ];

        if (options.crop) transformations.push(`c_${options.crop}`);
        if (options.width) transformations.push(`w_${options.width}`);
        if (options.height) transformations.push(`h_${options.height}`);

        // Join transformations with commas
        const transformationString = transformations.join(',');

        return `${baseUrl}/upload/${transformationString}/${path}`;
    } catch (error) {
        console.warn('Error optimizing Cloudinary URL:', error);
        return url;
    }
}
