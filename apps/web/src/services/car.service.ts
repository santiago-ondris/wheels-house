import { apiRequest } from "./api";

export interface CarData {
    carId?: number;
    name: string;
    color: string;
    brand: string;
    scale: string;
    manufacturer: string;
    description?: string;
    designer?: string;
    series?: string;
    pictures?: string[];
    country?: string;
    ownerUsername?: string;
}

export type CarUpdateDTO = Partial<CarData>;

export async function createCar(data: CarData): Promise<boolean> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<boolean>('/car/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
}

export async function listCars(username: string): Promise<CarData[]> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<CarData[]>(`/car/list/${username}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export async function getCar(carId: string): Promise<CarData> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<CarData>(`/car/info/${carId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export async function updateCar(carId: number, data: CarUpdateDTO): Promise<boolean> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<boolean>(`/car/update-info/${carId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
}

export async function deleteCar(carId: number): Promise<boolean> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<boolean>(`/car/${carId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export async function getFeaturedCar(): Promise<CarData | null> {
    return apiRequest<CarData | null>('/car/featured', {
        method: 'GET'
    });
}
