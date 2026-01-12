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
    condition?: string;
    ownerUsername?: string;
    wished?: boolean;
}

export interface CarSuggestions {
    names: string[];
    series: string[];
    designers: string[];
}

export type CarUpdateDTO = Partial<CarData>;

export async function createCar(data: CarData): Promise<number> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<number>('/car/create', {
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

export async function getCarGroups(carId: number): Promise<number[]> {
    return apiRequest<number[]>(`/car/${carId}/groups`);
}

export async function updateCarGroups(carId: number, groupIds: number[]): Promise<boolean> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<boolean>(`/car/${carId}/groups`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ groups: groupIds }),
    });
}

export async function getSuggestions(): Promise<CarSuggestions> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<CarSuggestions>(`/car/suggestions`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

// Paginated collection types
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

export interface FilterOption {
    name: string;
    count: number;
}

export interface FilterOptions {
    brands: FilterOption[];
    colors: FilterOption[];
    manufacturers: FilterOption[];
    scales: FilterOption[];
    conditions: FilterOption[];
    countries: FilterOption[];
}

export interface PaginatedCarsResponse {
    items: CarData[];
    pagination: PaginationMeta;
    filters: FilterOptions;
}

export interface CollectionQueryParams {
    page?: number;
    limit?: number;
    sortBy?: 'id' | 'name' | 'brand' | 'country';
    sortOrder?: 'asc' | 'desc';
    brands?: string[];
    colors?: string[];
    manufacturers?: string[];
    scales?: string[];
    conditions?: string[];
    countries?: string[];
    search?: string;
    groupId?: number;
}

export async function listCarsPaginated(username: string, params: CollectionQueryParams): Promise<PaginatedCarsResponse> {
    const queryParts: string[] = [];

    if (params.page) queryParts.push(`page=${params.page}`);
    if (params.limit) queryParts.push(`limit=${params.limit}`);
    if (params.sortBy) queryParts.push(`sortBy=${params.sortBy}`);
    if (params.sortOrder) queryParts.push(`sortOrder=${params.sortOrder}`);
    if (params.brands?.length) queryParts.push(`brands=${params.brands.join(',')}`);
    if (params.colors?.length) queryParts.push(`colors=${params.colors.join(',')}`);
    if (params.manufacturers?.length) queryParts.push(`manufacturers=${params.manufacturers.join(',')}`);
    if (params.scales?.length) queryParts.push(`scales=${params.scales.join(',')}`);
    if (params.conditions?.length) queryParts.push(`conditions=${params.conditions.join(',')}`);
    if (params.countries?.length) queryParts.push(`countries=${params.countries.join(',')}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.groupId) queryParts.push(`groupId=${params.groupId}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

    return apiRequest<PaginatedCarsResponse>(`/car/collection/${username}${queryString}`, {
        method: 'GET',
    });
}

export interface BulkAddToGroupRequest {
    groupId: number;
    carIds?: number[];
    filterQuery?: CollectionQueryParams;
}

export interface BulkAddToGroupResponse {
    addedCount: number;
    alreadyInGroup: number;
    totalRequested: number;
}

export async function bulkAddToGroup(request: BulkAddToGroupRequest): Promise<BulkAddToGroupResponse> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<BulkAddToGroupResponse>('/car/bulk/add-to-group', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request),
    });
}

// Wishlist functions
export interface WishlistCarData extends CarData {
    wished: boolean;
}

export async function getWishlist(username: string): Promise<WishlistCarData[]> {
    return apiRequest<WishlistCarData[]>(`/car/wishlist/${username}`, {
        method: 'GET',
    });
}

export interface WishedCarToCollectionDTO {
    name: string;
    color: string;
    brand: string;
    scale: string;
    manufacturer: string;
    condition: string;
    wished: false;
    description?: string;
    designer?: string;
    series?: string;
    pictures?: string[];
    country?: string;
    groups?: number[];
}

export async function wishedCarToCollection(carId: number, data: WishedCarToCollectionDTO): Promise<void> {
    const token = localStorage.getItem("auth_token");
    const API_URL = `http://${window.location.hostname}:3000`;
    
    const response = await fetch(`${API_URL}/car/wishedCarToCollection/${carId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw error;
    }
}

export async function createWishedCar(data: CarData & { wished: true }): Promise<number> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<number>('/car/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
}
