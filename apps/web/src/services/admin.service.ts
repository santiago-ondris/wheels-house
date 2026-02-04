import { apiRequest } from "./api";
import { CarData } from "./car.service";

// Featured Car types
export interface FeaturedCarSetting extends CarData {
    updatedAt?: string;
}

export interface CarSearchResult {
    carId: number;
    name: string;
    brand: string;
    manufacturer: string;
    color: string;
    scale: string;
    series: string | null;
    ownerUsername: string;
    picture: string | null;
}

// Featured Car Admin API
export async function getFeaturedCarSetting(): Promise<FeaturedCarSetting | null> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<FeaturedCarSetting | null>('/admin/featured-car', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export async function setFeaturedCarSetting(carId: number): Promise<{ success: boolean; carId: number }> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<{ success: boolean; carId: number }>('/admin/featured-car', {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ carId }),
    });
}

export async function searchCarsAdmin(query: string): Promise<CarSearchResult[]> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<CarSearchResult[]>(`/admin/cars/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
