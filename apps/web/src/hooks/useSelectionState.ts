import { useState, useCallback, useMemo } from 'react';

export type SelectAllMode = 'page' | 'all' | null;

export function useSelectionState(pageIds: number[], totalItems: number) {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [excludedIds, setExcludedIds] = useState<Set<number>>(new Set());
    const [selectAllMode, setSelectAllMode] = useState<SelectAllMode>(null);

    const setInitialSelection = useCallback((ids: number[]) => {
        setSelectedIds(new Set(ids));
        setExcludedIds(new Set());
        setSelectAllMode(null);
    }, []);

    const toggle = useCallback((id: number) => {
        if (selectAllMode === 'all') {
            setExcludedIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
            setSelectAllMode(null);
        }
    }, [selectAllMode]);

    const selectPage = useCallback(() => {
        setSelectedIds(new Set(pageIds));
        setExcludedIds(new Set());
        setSelectAllMode('page');
    }, [pageIds]);

    const selectAll = useCallback(() => {
        setSelectedIds(new Set(pageIds)); 
        setExcludedIds(new Set());
        setSelectAllMode('all');
    }, [pageIds]);

    const clear = useCallback(() => {
        setSelectedIds(new Set());
        setExcludedIds(new Set());
        setSelectAllMode(null);
    }, []);

    const isSelected = useCallback((id: number) => {
        if (selectAllMode === 'all') {
            return !excludedIds.has(id);
        }
        return selectedIds.has(id);
    }, [selectedIds, selectAllMode, excludedIds]);

    const isExplicitlyUnselected = useCallback((id: number) => {
        if (selectAllMode === 'all') return excludedIds.has(id);
        return false;
    }, [selectAllMode, excludedIds]);

    const selectedCount = useMemo(() => {
        if (selectAllMode === 'all') {
            return totalItems - excludedIds.size;
        }
        return selectedIds.size;
    }, [selectAllMode, selectedIds.size, totalItems, excludedIds.size]);

    const isPageFullySelected = useMemo(() => {
        if (pageIds.length === 0) return false;
        return pageIds.every(id => isSelected(id));
    }, [pageIds, isSelected]);

    const getSelectionForBulkAction = useCallback(() => {
        if (selectAllMode === 'all') {
            return { mode: 'all' as const, carIds: undefined, excludedIds: Array.from(excludedIds) };
        }
        return { mode: 'specific' as const, carIds: Array.from(selectedIds) };
    }, [selectAllMode, selectedIds, excludedIds]);

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
        setInitialSelection,
        isExplicitlyUnselected
    };
}
