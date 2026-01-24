import { API_URL, apiRequest } from './api';

// Types
export interface ImportCarRow {
    name: string;
    manufacturer: string;
    brand: string;
    scale: string;
    color: string;
    condition: string;
    series?: string | null;
    description?: string | null;
}

export interface ImportPreviewRow {
    row: number;
    data: ImportCarRow;
    isValid: boolean;
    errors: string[];
}

export interface ImportPreviewResponse {
    success: boolean;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    preview: ImportPreviewRow[];
}

export interface ImportResult {
    success: boolean;
    imported: number;
    failed: number;
    errors?: { index: number; name: string; error: string }[];
}

/**
 * Download the Excel template
 */
export async function downloadTemplate(): Promise<void> {
    const response = await fetch(`${API_URL}/car/import/template`);
    
    if (!response.ok) {
        throw new Error('Error al descargar la plantilla');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wheels-house-plantilla.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

/**
 * Upload Excel file for preview
 */
export async function uploadForPreview(file: File): Promise<ImportPreviewResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<ImportPreviewResponse>('/car/import/preview', {
        method: 'POST',
        headers: {
            'Content-Type': undefined as any, // This forces apiRequest to not set it
        },
        body: formData,
    });
}

/**
 * Confirm import of validated cars
 */
export async function confirmImport(cars: ImportCarRow[]): Promise<ImportResult> {
    return apiRequest<ImportResult>('/car/import/confirm', { 
        method: 'POST',
        body: JSON.stringify({ cars }),
    });
}
