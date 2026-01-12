import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import CollectionFilters from "./CollectionFilters";
import { FilterOptions } from "../../services/car.service";

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterOptions;
    selectedBrands: string[];
    selectedColors: string[];
    selectedManufacturers: string[];
    selectedScales: string[];
    selectedConditions: string[];
    selectedCountries: string[];
    onToggleFilter: (field: 'brands' | 'colors' | 'manufacturers' | 'scales' | 'conditions' | 'countries', value: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    totalResults: number;
}

export default function FilterDrawer({
    isOpen,
    onClose,
    filters,
    selectedBrands,
    selectedColors,
    selectedManufacturers,
    selectedScales,
    selectedConditions,
    selectedCountries,
    onToggleFilter,
    onClearFilters,
    hasActiveFilters,
    totalResults,
}: FilterDrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-[#0a0a0b] border-l border-white/10 z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="w-5 h-5 text-accent" />
                                <h2 className="text-lg font-mono font-bold text-white uppercase tracking-tight">
                                    Filtros
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <CollectionFilters
                                filters={filters}
                                selectedBrands={selectedBrands}
                                selectedColors={selectedColors}
                                selectedManufacturers={selectedManufacturers}
                                selectedScales={selectedScales}
                                selectedConditions={selectedConditions}
                                selectedCountries={selectedCountries}
                                onToggleFilter={onToggleFilter}
                                onClearFilters={onClearFilters}
                                hasActiveFilters={hasActiveFilters}
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-mono text-white/40">
                                    {totalResults} resultados
                                </span>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-accent hover:bg-accent/80 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors"
                                >
                                    Ver Resultados
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
