import { apiRequest } from "./api";
import { CarData } from "./car.service";

export interface PublicProfile {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    biography?: string;
    picture?: string;
    email?: string;
    createdDate?: string;
    totalCars: number;
    totalGroups: number;
    cars: CarData[];
    defaultSortPreference?: string;
    followersCount?: number;
    followingCount?: number;
    isFollowing?: boolean;
    isFollower?: boolean;
    isAdmin?: boolean;
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

export interface GlobalStats {
    totalUsers: number;
    totalCars: number;
    totalPhotos: number;
}

export interface HallOfFameFlags {
    isFounder: boolean;
    isContributor: boolean;
    isAmbassador: boolean;
    isLegend: boolean;
}

export interface HallOfFameMember {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture: string | null;
    hallOfFameTitle: string | null;
    hallOfFameFlags: HallOfFameFlags;
    carCount: number;
    totalLikes: number;
    showcaseCarImage: string | null;
    showcaseCarName: string | null;
    hallOfFameOrder: number | null;
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

export async function getFoundersCount(): Promise<number> {
    const response = await apiRequest<{ count: number }>('/founders/count');
    return response.count;
}

export async function getGlobalStats(): Promise<GlobalStats> {
    return apiRequest<GlobalStats>('/stats/global');
}

export async function getHoFMembers(category: string): Promise<HallOfFameMember[]> {
    return apiRequest<HallOfFameMember[]>(`/stats/hall-of-fame/${category}`);
}

export async function getFeaturedHoFMembers(): Promise<HallOfFameMember[]> {
    return apiRequest<HallOfFameMember[]>('/stats/hall-of-fame/featured');
}

export async function getSearchHistory(): Promise<BasicUser[]> {
    const token = localStorage.getItem("auth_token");
    // Add timestamp to prevent caching
    return apiRequest<BasicUser[]>(`/search-history?t=${new Date().getTime()}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export async function addToSearchHistory(searchedUsername: string): Promise<void> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<void>('/search-history', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ searchedUsername }),
    });
}

export async function removeFromSearchHistory(searchedUsername: string): Promise<void> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<void>(`/search-history/${encodeURIComponent(searchedUsername)}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
}

export async function clearSearchHistory(): Promise<void> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<void>('/search-history', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
}

export async function getUserStats(username: string): Promise<UserStats> {
    return apiRequest<UserStats>(`/stats/${username}`);
}

export async function updateProfile(data: Partial<PublicProfile>): Promise<PublicProfile> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<PublicProfile>('/user/update-info', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
}

export async function updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<void>('/user/update-password', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    });
}

export async function deleteUser(): Promise<void> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<void>('/user', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
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
