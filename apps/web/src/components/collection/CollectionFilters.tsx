import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";
import { FilterOptions } from "../../services/car.service";

interface FilterSectionProps {
    title: string;
    options: { name: string; count: number }[];
    selected: string[];
    onToggle: (value: string) => void;
    defaultOpen?: boolean;
}

function FilterSection({ title, options, selected, onToggle, defaultOpen = false }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (options.length === 0) return null;

    return (
        <div className="border-b border-white/5 pb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-2 text-white/60 hover:text-white transition-colors"
            >
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.15em]">
                    {title}
                    {selected.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 bg-accent/20 text-accent rounded text-[9px]">
                            {selected.length}
                        </span>
                    )}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {options.map((option) => (
                        <label
                            key={option.name}
                            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option.name)}
                                onChange={() => onToggle(option.name)}
                                className="w-3.5 h-3.5 rounded border-white/20 bg-transparent text-accent focus:ring-accent/50"
                            />
                            <span className="flex-1 text-xs text-white/70 group-hover:text-white truncate">
                                {option.name}
                            </span>
                            <span className="text-[10px] font-mono text-white/30">
                                {option.count}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

interface CollectionFiltersProps {
    filters: FilterOptions;
    selectedBrands: string[];
    selectedColors: string[];
    selectedManufacturers: string[];
    selectedScales: string[];
    selectedConditions: string[];
    selectedCountries: string[];
    selectedHasPicture: string[];
    onToggleFilter: (field: 'brands' | 'colors' | 'manufacturers' | 'scales' | 'conditions' | 'countries' | 'hasPicture', value: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export default function CollectionFilters({
    filters,
    selectedBrands,
    selectedColors,
    selectedManufacturers,
    selectedScales,
    selectedConditions,
    selectedCountries,
    selectedHasPicture,
    onToggleFilter,
    onClearFilters,
    hasActiveFilters,
}: CollectionFiltersProps) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-accent" />
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                        Filtros
                    </h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1 text-[10px] font-mono text-accent hover:text-accent/80 uppercase tracking-wider"
                    >
                        <X className="w-3 h-3" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* Filter Sections */}
            <FilterSection
                title="Marca"
                options={filters.brands}
                selected={selectedBrands}
                onToggle={(v) => onToggleFilter('brands', v)}
                defaultOpen={true}
            />
            <FilterSection
                title="Color"
                options={filters.colors}
                selected={selectedColors}
                onToggle={(v) => onToggleFilter('colors', v)}
            />
            <FilterSection
                title="Fabricante"
                options={filters.manufacturers}
                selected={selectedManufacturers}
                onToggle={(v) => onToggleFilter('manufacturers', v)}
            />
            <FilterSection
                title="Escala"
                options={filters.scales}
                selected={selectedScales}
                onToggle={(v) => onToggleFilter('scales', v)}
            />
            <FilterSection
                title="Estado"
                options={filters.conditions}
                selected={selectedConditions}
                onToggle={(v) => onToggleFilter('conditions', v)}
            />
            <FilterSection
                title="País"
                options={filters.countries}
                selected={selectedCountries}
                onToggle={(v) => onToggleFilter('countries', v)}
            />
            <FilterSection
                title="Con Imagen"
                options={filters.hasPicture}
                selected={selectedHasPicture}
                onToggle={(v) => onToggleFilter('hasPicture', v)}
            />
        </div>
    );
}
