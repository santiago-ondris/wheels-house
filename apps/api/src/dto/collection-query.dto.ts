/**
 * DTO para la paginación de coleccion  
 */

export class CollectionQueryDTO {
    // Paginacion
    page?: number = 1;
    limit?: number = 15;

    // Ordenamiento
    sortBy?: 'id' | 'name' | 'brand' | 'country' = 'id';
    sortOrder?: 'asc' | 'desc' = 'desc';

    // Filtros
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

    // Busqueda de texto
    search?: string;

    // Filtro por grupo
    groupId?: number;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

export interface FilterOptions {
    brands: { name: string; count: number }[];
    colors: { name: string; count: number }[];
    manufacturers: { name: string; count: number }[];
    scales: { name: string; count: number }[];
    conditions: { name: string; count: number }[];
    countries: { name: string; count: number }[];
    hasPicture: { name: string; count: number }[];
    rarities: { name: string; count: number }[];
    qualities: { name: string; count: number }[];
    varieties: { name: string; count: number }[];
    finishes: { name: string; count: number }[];
}

export interface PaginatedCarsResponse<T> {
    items: T[];
    pagination: PaginationMeta;
    filters: FilterOptions;
}

// Para acciones masivas con seleccion basada en filtros
export class BulkAddToGroupDTO {
    carIds?: number[];         // IDs específicos (para selección de página)
    filterQuery?: CollectionQueryDTO;  // Selección basada en filtros
    groupId: number;
}
