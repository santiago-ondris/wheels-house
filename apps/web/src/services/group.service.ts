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
}

export interface GroupBasicInfo {
    groupId: number;
    name: string;
    totalCars: number;
    description?: string;
    picture?: string;
    featured: boolean;
    order?: number | null;
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
    return apiRequest<boolean>('/group/create', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function getGroup(groupId: number | string): Promise<GroupData> {
    return apiRequest<GroupData>(`/group/info/${groupId}`);
}

export async function getGroupByName(username: string, groupName: string): Promise<GroupData> {
    return apiRequest<GroupData>(`/group/by-name/${username}/${encodeURIComponent(groupName)}`);
}

export async function listGroups(username: string): Promise<GroupBasicInfo[]> {
    return apiRequest<GroupBasicInfo[]>(`/group/list/${username}`);
}

export async function listFeaturedGroups(username: string): Promise<GroupBasicInfo[]> {
    return apiRequest<GroupBasicInfo[]>(`/group/featured/${username}`);
}

export async function updateGroup(groupId: number, data: UpdateGroupData): Promise<boolean> {
    return apiRequest<boolean>(`/group/update/${groupId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteGroup(groupId: number): Promise<boolean> {
    return apiRequest<boolean>(`/group/${groupId}`, {
        method: 'DELETE',
    });
}
