const API_URL = `http://${window.location.hostname}:3000`;

export async function uploadImage(file: File, isPublic = false): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');

    // Only throw if NOT public and no token
    if (!token && !isPublic) {
        throw new Error('No encontramos tu sesión. Por favor iniciá sesión nuevamente.');
    }

    const endpoint = isPublic && !token ? `${API_URL}/upload/image/public` : `${API_URL}/upload/image`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Tu sesión expiró. Por favor iniciá sesión nuevamente.');
        }
        if (response.status === 413) {
            throw new Error('La imagen es demasiado grande. Máximo 10MB.');
        }
        if (response.status === 400) {
            const error = await response.json().catch(() => null);
            throw new Error(error?.message || 'Formato de imagen no válido. Usá JPG, PNG, GIF o WEBP.');
        }

        const error = await response.json().catch(() => ({ message: 'Error al subir la imagen' }));
        throw new Error(error.message || 'Error al conectarse con el servidor');
    }

    const data = await response.json();
    return data.url;
}

export async function deleteRemoteImage(publicId: string): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
        await fetch(`${API_URL}/upload/image/${encodeURIComponent(publicId)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

