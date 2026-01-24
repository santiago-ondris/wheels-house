import { apiRequest } from './api';

interface CloudinarySignature {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
    eager: string;
}

/**
 * Obtiene una firma para subir imágenes directamente a Cloudinary.
 * Solo funciona para usuarios autenticados.
 */
async function getUploadSignature(): Promise<CloudinarySignature> {
    try {
        return await apiRequest<CloudinarySignature>('/upload/signature', {
            method: 'GET',
        });
    } catch (error: any) {
        if (error.statusCode === 401) {
            throw new Error('Tu sesión expiró. Por favor iniciá sesión nuevamente.');
        }
        throw new Error('Error al obtener permisos de subida');
    }
}

/**
 * Sube una imagen directamente a Cloudinary usando una solicitud firmada.
 * Esto evita el límite de Railway.
 */
export async function uploadImage(file: File, isPublic = false): Promise<string> {
    // Para subidas públicas (e.g., avatar de registro), aún necesitamos pasar por el backend
    // ya que los usuarios públicos no pueden obtener firmas
    if (isPublic) {
        return uploadImageViaBackend(file, true);
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
        // Fallback to public backend upload
        return uploadImageViaBackend(file, true);
    }

    try {
        // Obtiene una firma del backend
        const sig = await getUploadSignature();

        // Construye FormData para Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', sig.apiKey);
        formData.append('timestamp', sig.timestamp.toString());
        formData.append('signature', sig.signature);
        formData.append('folder', sig.folder);
        formData.append('eager', sig.eager);

        // Sube directamente a Cloudinary
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;

        const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Cloudinary upload error:', errorData);
            throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        return data.secure_url;

    } catch (error) {
        console.error('Direct upload failed, falling back to backend:', error);
        // Fallback to backend if direct upload fails
        return uploadImageViaBackend(file, false);
    }
}

/**
 * Sube una imagen a través del backend (para subidas públicas o cuando la subida directa falla).
 * Esto pasa por Railway y puede estar sujeto a rate limits.
 */
async function uploadImageViaBackend(file: File, isPublic: boolean): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    const endpoint = isPublic && !token ? '/upload/image/public' : '/upload/image';

    try {
        const data = await apiRequest<{ url: string }>(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': undefined as any, // Important for FormData
            },
            body: formData,
        });
        return data.url;
    } catch (error: any) {
        if (error.statusCode === 413) {
            throw new Error('La imagen es demasiado grande. Máximo 10MB.');
        }
        if (error.statusCode === 400) {
            throw new Error(error.message || 'Formato de imagen no válido. Usá JPG, PNG, GIF o WEBP.');
        }
        if (error.statusCode === 429) {
            throw new Error('Demasiadas peticiones. Por favor esperá un momento.');
        }
        throw new Error(error.message || 'Error al subir la imagen');
    }
}

export async function deleteRemoteImage(publicId: string): Promise<void> {
    try {
        await apiRequest(`/upload/image/${encodeURIComponent(publicId)}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}
