import { apiRequest } from "./api";

interface RegisterData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    biography?: string;
    picture?: string;
}

interface LoginData {
    usernameOrEmail: string;
    password: string;
}

interface LoginResponse {
    authorization: string;
}

export async function register(data: RegisterData): Promise<boolean> {
    return apiRequest<boolean>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function login(data: LoginData): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}