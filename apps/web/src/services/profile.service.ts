import { apiRequest } from "./api";
import { CarData } from "./car.service";

export interface PublicProfile {
    username: string;
    firstName: string;
    lastName: string;
    biography?: string;
    picture?: string;
    createdDate?: string;
    totalCars: number;
    totalGroups: number;
    cars: CarData[];
    defaultSortPreference?: string;
}

export interface DistributionItem {
    name: string;
    count: number;
}

export interface UserStats {
    totalCars: number;
    distinctBrands: number;
    favoriteNationality: string | null;
    totalPhotos: number;
    brandDistribution: DistributionItem[];
    manufacturerDistribution: DistributionItem[];
    scaleDistribution: DistributionItem[];
    colorDistribution: DistributionItem[];
    conditionDistribution: DistributionItem[];
    countryDistribution: DistributionItem[];
}

export interface BasicUser {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture?: string;
}

export interface Founder {
    founderNumber: number;
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture?: string;
    createdDate: string;
    carCount: number;
}

export async function getPublicProfile(username: string): Promise<PublicProfile> {
    return apiRequest<PublicProfile>(`/profile/${username}`);
}

export async function searchUsers(query: string): Promise<BasicUser[]> {
    return apiRequest<BasicUser[]>(`/search?q=${encodeURIComponent(query)}`);
}

export async function getFounders(): Promise<Founder[]> {
    return apiRequest<Founder[]>('/founders');
}

export async function getSearchHistory(): Promise<BasicUser[]> {
    // Add timestamp to prevent caching
    return apiRequest<BasicUser[]>(`/search-history?t=${new Date().getTime()}`);
}

export async function addToSearchHistory(searchedUsername: string): Promise<void> {
    return apiRequest<void>('/search-history', {
        method: 'POST',
        body: JSON.stringify({ searchedUsername }),
    });
}

export async function removeFromSearchHistory(searchedUsername: string): Promise<void> {
    return apiRequest<void>(`/search-history/${encodeURIComponent(searchedUsername)}`, {
        method: 'DELETE',
    });
}

export async function clearSearchHistory(): Promise<void> {
    return apiRequest<void>('/search-history', {
        method: 'DELETE',
    });
}

export async function getUserStats(username: string): Promise<UserStats> {
    return apiRequest<UserStats>(`/stats/${username}`);
}

export async function updateProfile(data: Partial<PublicProfile>): Promise<PublicProfile> {
    return apiRequest<PublicProfile>('/user/update-info', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    return apiRequest<void>('/user/update-password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
    });
}

export async function deleteUser(): Promise<void> {
    return apiRequest<void>('/user', {
        method: 'DELETE',
    });
}

export async function requestPasswordRecovery(usernameOrEmail: string): Promise<void> {
    return apiRequest<void>('/user/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ usernameOrEmail }),
    });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    return apiRequest<void>(`/user/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify({ newPassword }),
    });
}
