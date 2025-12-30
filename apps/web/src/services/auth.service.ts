import { apiRequest } from "./api";

interface RegisterData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export async function register(data: RegisterData): Promise<boolean> {
    return apiRequest<boolean>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}