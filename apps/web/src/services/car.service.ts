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
    rarity?: string;
    quality?: string;
    variety?: string;
    finish?: string;
}

export interface CarSuggestions {
    names: string[];
    series: string[];
    designers: string[];
}

export type CarUpdateDTO = Partial<CarData>;

export async function createCar(data: CarData): Promise<number> {
    return apiRequest<number>('/car/create', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function listCars(username: string): Promise<CarData[]> {
    return apiRequest<CarData[]>(`/car/list/${username}`, {
        method: 'GET',
    });
}

export async function getCar(carId: string): Promise<CarData> {
    return apiRequest<CarData>(`/car/info/${carId}`, {
        method: 'GET',
    });
}

export async function updateCar(carId: number, data: CarUpdateDTO): Promise<boolean> {
    return apiRequest<boolean>(`/car/update-info/${carId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteCar(carId: number): Promise<boolean> {
    return apiRequest<boolean>(`/car/${carId}`, {
        method: 'DELETE',
    });
}

export async function getCarGroups(carId: number): Promise<number[]> {
    return apiRequest<number[]>(`/car/${carId}/groups`);
}

export async function updateCarGroups(carId: number, groupIds: number[]): Promise<boolean> {
    return apiRequest<boolean>(`/car/${carId}/groups`, {
        method: 'PUT',
        body: JSON.stringify({ groups: groupIds }),
    });
}

export async function getSuggestions(): Promise<CarSuggestions> {
    return apiRequest<CarSuggestions>(`/car/suggestions`, {
        method: 'GET',
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
    hasPicture: FilterOption[];
    rarities: FilterOption[];
    qualities: FilterOption[];
    varieties: FilterOption[];
    finishes: FilterOption[];
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
    hasPicture?: string[];
    rarities?: string[];
    qualities?: string[];
    varieties?: string[];
    finishes?: string[];
    search?: string;
    groupId?: number;
}

export async function listCarsPaginated(username: string, params: CollectionQueryParams): Promise<PaginatedCarsResponse> {
    const queryParts: string[] = [];

    if (params.page) queryParts.push(`page=${params.page}`);
    if (params.limit) queryParts.push(`limit=${params.limit}`);
    queryParts.push(`sortBy=${params.sortBy || 'id'}`);
    queryParts.push(`sortOrder=${params.sortOrder || 'desc'}`);
    if (params.brands?.length) queryParts.push(`brands=${params.brands.join(',')}`);
    if (params.colors?.length) queryParts.push(`colors=${params.colors.join(',')}`);
    if (params.manufacturers?.length) queryParts.push(`manufacturers=${params.manufacturers.join(',')}`);
    if (params.scales?.length) queryParts.push(`scales=${params.scales.join(',')}`);
    if (params.conditions?.length) queryParts.push(`conditions=${params.conditions.join(',')}`);
    if (params.countries?.length) queryParts.push(`countries=${params.countries.join(',')}`);
    if (params.hasPicture?.length) queryParts.push(`hasPicture=${params.hasPicture.join(',')}`);
    if (params.rarities?.length) queryParts.push(`rarities=${params.rarities.join(',')}`);
    if (params.qualities?.length) queryParts.push(`qualities=${params.qualities.join(',')}`);
    if (params.varieties?.length) queryParts.push(`varieties=${params.varieties.join(',')}`);
    if (params.finishes?.length) queryParts.push(`finishes=${params.finishes.join(',')}`);
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
    return apiRequest<BulkAddToGroupResponse>('/car/bulk/add-to-group', {
        method: 'POST',
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
    return apiRequest<void>(`/car/wishedCarToCollection/${carId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function createWishedCar(data: CarData & { wished: true }): Promise<number> {
    return apiRequest<number>('/car/create', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
