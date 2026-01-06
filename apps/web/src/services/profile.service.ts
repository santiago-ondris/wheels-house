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

export async function getPublicProfile(username: string): Promise<PublicProfile> {
    return apiRequest<PublicProfile>(`/profile/${username}`);
}
