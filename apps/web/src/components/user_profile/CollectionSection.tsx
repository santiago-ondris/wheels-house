import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Car, SlidersHorizontal, Search, X } from "lucide-react";
import toast from "react-hot-toast";

import { useCollectionParams } from "../../hooks/useCollectionParams";
import { useSelectionState } from "../../hooks/useSelectionState";
import { listCarsPaginated, PaginatedCarsResponse, bulkAddToGroup, CollectionQueryParams } from "../../services/car.service";
import { listGroups } from "../../services/group.service";

import HotWheelCardGrid from "../collection/HotWheelCardGrid";
import HotWheelCardList from "../collection/HotWheelCardList";
import ViewSwitcher from "../collection/ViewSwitcher";
import CollectionFilters from "../collection/CollectionFilters";
import FilterDrawer from "../collection/FilterDrawer";
import SortSelector from "../collection/SortSelector";
import Pagination from "../collection/Pagination";
import SelectionToolbar from "../collection/SelectionToolbar";

interface CollectionSectionProps {
    username: string;
    isOwner: boolean;
}

interface Group {
    groupId: number;
    name: string;
}

export default function CollectionSection({ username, isOwner }: CollectionSectionProps) {
    const navigate = useNavigate();
    const { params, setPage, setLimit, setSort, setSearch, toggleFilter, clearFilters, hasActiveFilters } = useCollectionParams();

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<PaginatedCarsResponse | null>(null);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);
    const [searchInput, setSearchInput] = useState(params.search);

    // Get page IDs for selection
    const pageIds = data?.items.map(car => car.carId!) || [];
    const selection = useSelectionState(pageIds, data?.pagination.totalItems || 0);

    // Fetch cars when params change
    useEffect(() => {
        const fetchCars = async () => {
            setIsLoading(true);
            try {
                const response = await listCarsPaginated(username, params);
                setData(response);
            } catch (error) {
                console.error("Error fetching cars:", error);
                toast.error("Error al cargar la colección");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCars();
    }, [username, params]);

    // Fetch user groups for bulk add modal
    useEffect(() => {
        if (isOwner) {
            listGroups(username).then(g => setGroups(g.map(gr => ({ groupId: gr.groupId, name: gr.name })))).catch(console.error);
        }
    }, [username, isOwner]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== params.search) {
                setSearch(searchInput);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput, params.search, setSearch]);

    // Clear selection when leaving select mode
    useEffect(() => {
        if (!isSelectMode) {
            selection.clear();
        }
    }, [isSelectMode]);

    const handleAddToGroup = useCallback(async (groupId: number) => {
        try {
            const selectionData = selection.getSelectionForBulkAction();

            let request: { groupId: number; carIds?: number[]; filterQuery?: CollectionQueryParams };

            if (selectionData.mode === 'all') {
                // Use filter-based selection (Option A)
                request = { groupId, filterQuery: params };
            } else {
                // Use specific IDs
                request = { groupId, carIds: selectionData.carIds };
            }

            const result = await bulkAddToGroup(request);

            const addedCount = result.addedCount ?? 0;
            const alreadyInGroup = result.alreadyInGroup ?? 0;

            if (addedCount === 0 && alreadyInGroup > 0) {
                toast(`Todos los ${alreadyInGroup} autos ya estaban en el grupo`, {
                    icon: 'ℹ️',
                });
            } else if (alreadyInGroup > 0) {
                toast.success(
                    `${addedCount} añadidos • ${alreadyInGroup} ya estaban`
                );
            } else {
                toast.success(`${addedCount} autos añadidos al grupo`);
            }

            setShowGroupModal(false);
            setIsSelectMode(false);
            selection.clear();
        } catch (error) {
            console.error("Error adding to group:", error);
            toast.error("Error al añadir al grupo");
        }
    }, [selection, params]);

    const mappedCars = (data?.items || []).map((car) => ({
        id: String(car.carId),
        name: car.name,
        brand: car.brand,
        year: 0,
        series: car.series || undefined,
        manufacturer: car.manufacturer || undefined,
        image: car.pictures && car.pictures.length > 0
            ? car.pictures[0]
            : "https://placehold.co/400x300/1A1B4B/D9731A?text=No+Image"
    }));

    const defaultFilters = {
        brands: [],
        colors: [],
        manufacturers: [],
        scales: [],
        conditions: [],
        countries: [],
    };

    const filters = data?.filters || defaultFilters;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-accent" />
                    Toda mi Colección
                    {data && (
                        <span className="text-accent/70 text-sm font-normal ml-2">
                            ({data.pagination.totalItems})
                        </span>
                    )}
                </h2>
                <div className="flex items-center gap-2">
                    {isOwner && !isSelectMode && (
                        <button
                            onClick={() => setIsSelectMode(true)}
                            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Seleccionar múltiples"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </button>
                    )}
                    {isSelectMode && (
                        <button
                            onClick={() => setIsSelectMode(false)}
                            className="px-3 py-1.5 text-xs font-mono text-white/60 hover:text-white border border-white/10 rounded-lg transition-colors"
                        >
                            Cancelar selección
                        </button>
                    )}
                    {isOwner && !isSelectMode && (data?.items?.length ?? 0) > 0 && (
                        <button
                            onClick={() => navigate("/collection/add")}
                            className="p-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline text-xs uppercase tracking-widest font-bold">
                                Nuevo
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-6">
                {/* Desktop Sidebar Filters */}
                <div className="hidden lg:block w-64 shrink-0">
                    <div className="sticky top-20 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                        <CollectionFilters
                            filters={filters}
                            selectedBrands={params.brands}
                            selectedColors={params.colors}
                            selectedManufacturers={params.manufacturers}
                            selectedScales={params.scales}
                            selectedConditions={params.conditions}
                            selectedCountries={params.countries}
                            onToggleFilter={toggleFilter}
                            onClearFilters={clearFilters}
                            hasActiveFilters={hasActiveFilters}
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    {/* Controls Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Buscar en mi colección..."
                                className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent text-base"
                            />
                            {searchInput && (
                                <button
                                    onClick={() => setSearchInput('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Right Controls */}
                        <div className="flex gap-2">
                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setIsFilterDrawerOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4 text-white/60" />
                                <span className="text-xs font-mono text-white/70 uppercase tracking-wider">
                                    Filtros
                                    {hasActiveFilters && (
                                        <span className="ml-1.5 px-1.5 py-0.5 bg-accent/20 text-accent rounded text-[9px]">
                                            •
                                        </span>
                                    )}
                                </span>
                            </button>

                            <SortSelector
                                sortBy={params.sortBy}
                                sortOrder={params.sortOrder}
                                onSort={setSort}
                            />
                            <ViewSwitcher view={view} onViewChange={setView} />
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-4/3 bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && (data?.items?.length ?? 0) === 0 && (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <Car className="w-16 h-16 mx-auto mb-4 text-white/20" />
                            <p className="text-white/60 text-lg mb-2">
                                {hasActiveFilters
                                    ? "No se encontraron resultados"
                                    : isOwner
                                        ? "Tu colección está vacía"
                                        : "Esta colección está vacía"
                                }
                            </p>
                            {hasActiveFilters ? (
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                                >
                                    Limpiar filtros
                                </button>
                            ) : isOwner && (
                                <button
                                    onClick={() => navigate("/collection/add")}
                                    className="mt-4 px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg transition-all flex items-center gap-2 mx-auto"
                                >
                                    <Plus className="w-5 h-5" />
                                    Agregar tu primer auto
                                </button>
                            )}
                        </div>
                    )}

                    {/* Cars Grid/List */}
                    {!isLoading && (data?.items?.length ?? 0) > 0 && (
                        <>
                            <AnimatePresence mode="wait">
                                {view === "grid" ? (
                                    <motion.div
                                        key="grid"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                                    >
                                        {mappedCars.map((car) => (
                                            <HotWheelCardGrid
                                                key={car.id}
                                                car={car}
                                                onClick={() => navigate(`/car/${car.id}`)}
                                                selectable={isSelectMode}
                                                isSelected={selection.isSelected(Number(car.id))}
                                                onSelect={() => selection.toggle(Number(car.id))}
                                            />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="list"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col gap-3"
                                    >
                                        {mappedCars.map((car) => (
                                            <HotWheelCardList
                                                key={car.id}
                                                car={car}
                                                onClick={() => navigate(`/car/${car.id}`)}
                                                selectable={isSelectMode}
                                                isSelected={selection.isSelected(Number(car.id))}
                                                onSelect={() => selection.toggle(Number(car.id))}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Pagination */}
                            {data && data.pagination.totalPages > 1 && (
                                <Pagination
                                    currentPage={data.pagination.currentPage}
                                    totalPages={data.pagination.totalPages}
                                    totalItems={data.pagination.totalItems}
                                    limit={data.pagination.limit}
                                    onPageChange={setPage}
                                    onLimitChange={setLimit}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <FilterDrawer
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                filters={filters}
                selectedBrands={params.brands}
                selectedColors={params.colors}
                selectedManufacturers={params.manufacturers}
                selectedScales={params.scales}
                selectedConditions={params.conditions}
                selectedCountries={params.countries}
                onToggleFilter={toggleFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                totalResults={data?.pagination.totalItems || 0}
            />

            {/* Selection Toolbar */}
            <AnimatePresence>
                {isSelectMode && selection.selectedCount > 0 && (
                    <SelectionToolbar
                        selectedCount={selection.selectedCount}
                        totalItems={data?.pagination.totalItems || 0}
                        selectAllMode={selection.selectAllMode}
                        isPageFullySelected={selection.isPageFullySelected}
                        onSelectPage={selection.selectPage}
                        onSelectAll={selection.selectAll}
                        onClear={selection.clear}
                        onAddToGroup={() => setShowGroupModal(true)}
                    />
                )}
            </AnimatePresence>

            {/* Add to Group Modal */}
            <AnimatePresence>
                {showGroupModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowGroupModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-[#0a0a0b] border border-white/10 rounded-2xl p-6 z-50"
                        >
                            <h3 className="text-lg font-mono font-bold text-white uppercase tracking-tight mb-4">
                                Añadir a Grupo
                            </h3>
                            <p className="text-sm text-white/50 mb-6">
                                {selection.selectAllMode === 'all'
                                    ? `Añadir ${data?.pagination.totalItems} autos a:`
                                    : `Añadir ${selection.selectedCount} autos a:`
                                }
                            </p>

                            {groups.length === 0 ? (
                                <p className="text-center text-white/40 py-8">
                                    No tienes grupos creados
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {groups.map((group) => (
                                        <button
                                            key={group.groupId}
                                            onClick={() => handleAddToGroup(group.groupId)}
                                            className="w-full px-4 py-3 text-left bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 rounded-xl transition-colors"
                                        >
                                            <span className="text-sm font-medium text-white">{group.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setShowGroupModal(false)}
                                className="w-full mt-6 py-3 text-sm font-mono text-white/60 hover:text-white border border-white/10 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
