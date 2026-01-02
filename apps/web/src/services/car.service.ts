import { apiRequest } from "./api";

export interface CarData {
    name: string;
    color: string;
    brand: string;
    scale: string;
    manufacturer: string;
    description?: string;
    designer?: string;
    series?: string;
    picture?: string;
}

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
