import { apiRequest } from "./api";
import { CarData } from "./car.service";

export interface PublicProfile {
    username: string;
    firstName: string;
    lastName: string;
    picture?: string;
    createdDate?: string;
    totalCars: number;
    totalGroups: number;
    cars: CarData[];
}

export interface BasicUser {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture?: string;
}

export async function getPublicProfile(username: string): Promise<PublicProfile> {
    return apiRequest<PublicProfile>(`/profile/${username}`);
}

export async function searchUsers(query: string): Promise<BasicUser[]> {
    return apiRequest<BasicUser[]>(`/search?q=${encodeURIComponent(query)}`);
}
