import { useState, useCallback, useMemo } from 'react';

export type SelectAllMode = 'page' | 'all' | null;

export function useSelectionState(pageIds: number[], totalItems: number) {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [selectAllMode, setSelectAllMode] = useState<SelectAllMode>(null);

    const toggle = useCallback((id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
        setSelectAllMode(null); // Clear special modes when manually toggling
    }, []);

    const selectPage = useCallback(() => {
        setSelectedIds(new Set(pageIds));
        setSelectAllMode('page');
    }, [pageIds]);

    const selectAll = useCallback(() => {
        // When selecting "all", we set a flag but don't actually load all IDs
        // The actual IDs will be resolved server-side via filterQuery
        setSelectedIds(new Set(pageIds)); // Visually select current page
        setSelectAllMode('all');
    }, [pageIds]);

    const clear = useCallback(() => {
        setSelectedIds(new Set());
        setSelectAllMode(null);
    }, []);

    const isSelected = useCallback((id: number) => {
        return selectedIds.has(id);
    }, [selectedIds]);

    const selectedCount = useMemo(() => {
        if (selectAllMode === 'all') {
            return totalItems;
        }
        return selectedIds.size;
    }, [selectAllMode, selectedIds.size, totalItems]);

    const isPageFullySelected = useMemo(() => {
        if (pageIds.length === 0) return false;
        return pageIds.every(id => selectedIds.has(id));
    }, [pageIds, selectedIds]);

    const getSelectionForBulkAction = useCallback(() => {
        if (selectAllMode === 'all') {
            return { mode: 'all' as const, carIds: undefined };
        }
        return { mode: 'specific' as const, carIds: Array.from(selectedIds) };
    }, [selectAllMode, selectedIds]);

    return {
        selectedIds,
        selectedCount,
        selectAllMode,
        toggle,
        selectPage,
        selectAll,
        clear,
        isSelected,
        isPageFullySelected,
        getSelectionForBulkAction,
    };
}
