import { apiRequest } from "./api";
import { CarData } from "./car.service";

export interface GroupData {
    groupId?: number;
    name: string;
    totalCars?: number;
    description?: string;
    picture?: string;
    featured?: boolean;
    order?: number | null;
    cars?: CarData[];
    likesCount?: number;
    isLiked?: boolean;
}


export interface GroupBasicInfo {
    groupId: number;
    name: string;
    totalCars: number;
    description?: string;
    picture?: string;
    featured: boolean;
    order?: number | null;
    likesCount?: number;
    isLiked?: boolean;
}


export interface CreateGroupData {
    name: string;
    description?: string;
    picture?: string;
    featured?: boolean;
    order?: number | null;
    cars?: number[];
}

export type UpdateGroupData = CreateGroupData;

export async function createGroup(data: CreateGroupData): Promise<boolean> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<boolean>('/group/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
}

export async function getGroup(groupId: number | string): Promise<GroupData> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<GroupData>(`/group/info/${groupId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
}

export async function getGroupByName(username: string, groupName: string): Promise<GroupData> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<GroupData>(`/group/by-name/${username}/${encodeURIComponent(groupName)}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
}

export async function listGroups(username: string): Promise<GroupBasicInfo[]> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<GroupBasicInfo[]>(`/group/list/${username}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
}

export async function listFeaturedGroups(username: string): Promise<GroupBasicInfo[]> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<GroupBasicInfo[]>(`/group/featured/${username}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
}


export async function updateGroup(groupId: number, data: UpdateGroupData): Promise<boolean> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<boolean>(`/group/update/${groupId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
}

export async function deleteGroup(groupId: number): Promise<boolean> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<boolean>(`/group/${groupId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
