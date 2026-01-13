import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export type SortBy = 'id' | 'name' | 'brand' | 'country';
export type SortOrder = 'asc' | 'desc';

export interface CollectionParams {
    page: number;
    limit: number;
    sortBy: SortBy;
    sortOrder: SortOrder;
    brands: string[];
    colors: string[];
    manufacturers: string[];
    scales: string[];
    conditions: string[];
    countries: string[];
    search: string;
}

const DEFAULTS: CollectionParams = {
    page: 1,
    limit: 15,
    sortBy: 'id',
    sortOrder: 'desc',
    brands: [],
    colors: [],
    manufacturers: [],
    scales: [],
    conditions: [],
    countries: [],
    search: '',
};

function parseArray(value: string | null): string[] {
    if (!value) return [];
    return value.split(',').filter(v => v.trim());
}

function serializeArray(arr: string[]): string | undefined {
    if (!arr || arr.length === 0) return undefined;
    return arr.join(',');
}

export function useCollectionParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const params: CollectionParams = useMemo(() => ({
        page: parseInt(searchParams.get('page') || '') || DEFAULTS.page,
        limit: parseInt(searchParams.get('limit') || '') || DEFAULTS.limit,
        sortBy: (searchParams.get('sortBy') as SortBy) || DEFAULTS.sortBy,
        sortOrder: (searchParams.get('sortOrder') as SortOrder) || DEFAULTS.sortOrder,
        brands: parseArray(searchParams.get('brands')),
        colors: parseArray(searchParams.get('colors')),
        manufacturers: parseArray(searchParams.get('manufacturers')),
        scales: parseArray(searchParams.get('scales')),
        conditions: parseArray(searchParams.get('conditions')),
        countries: parseArray(searchParams.get('countries')),
        search: searchParams.get('search') || DEFAULTS.search,
    }), [searchParams]);

    const setParams = useCallback((updates: Partial<CollectionParams>, options?: { replace?: boolean }) => {
        const isOnlyPageChange = Object.keys(updates).length === 1 && 'page' in updates;
        const shouldReplace = options?.replace ?? !isOnlyPageChange;

        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);

            // When changing filters, reset to page 1
            const isFilterChange = Object.keys(updates).some(
                k => !['page'].includes(k)
            );
            if (isFilterChange && !('page' in updates)) {
                updates.page = 1;
            }

            const merged = { ...params, ...updates };

            // Set or delete each param
            Object.entries(merged).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    const serialized = serializeArray(value);
                    if (serialized) {
                        newParams.set(key, serialized);
                    } else {
                        newParams.delete(key);
                    }
                } else if (value !== undefined && value !== '' && value !== DEFAULTS[key as keyof CollectionParams]) {
                    newParams.set(key, String(value));
                } else {
                    newParams.delete(key);
                }
            });

            return newParams;
        }, { replace: shouldReplace });
    }, [params, setSearchParams]);

    const setPage = useCallback((page: number) => setParams({ page }), [setParams]);
    const setLimit = useCallback((limit: number) => setParams({ limit, page: 1 }), [setParams]);
    const setSort = useCallback((sortBy: SortBy, sortOrder: SortOrder) => setParams({ sortBy, sortOrder }), [setParams]);
    const setSearch = useCallback((search: string) => setParams({ search }), [setParams]);

    const toggleFilter = useCallback((field: keyof Pick<CollectionParams, 'brands' | 'colors' | 'manufacturers' | 'scales' | 'conditions' | 'countries'>, value: string) => {
        const current = params[field];
        const newValues = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setParams({ [field]: newValues });
    }, [params, setParams]);

    const clearFilters = useCallback(() => {
        setParams({
            brands: [],
            colors: [],
            manufacturers: [],
            scales: [],
            conditions: [],
            countries: [],
            search: '',
            page: 1,
        });
    }, [setParams]);

    const hasActiveFilters = useMemo(() => {
        return params.brands.length > 0 ||
            params.colors.length > 0 ||
            params.manufacturers.length > 0 ||
            params.scales.length > 0 ||
            params.conditions.length > 0 ||
            params.countries.length > 0 ||
            params.search.length > 0;
    }, [params]);

    return {
        params,
        setParams,
        setPage,
        setLimit,
        setSort,
        setSearch,
        toggleFilter,
        clearFilters,
        hasActiveFilters,
    };
}
