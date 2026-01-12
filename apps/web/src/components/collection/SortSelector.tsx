import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type SortOption = {
    label: string;
    sortBy: 'id' | 'name' | 'brand' | 'country';
    sortOrder: 'asc' | 'desc';
};

const SORT_OPTIONS: SortOption[] = [
    { label: "Más nuevo primero", sortBy: 'id', sortOrder: 'desc' },
    { label: "Más viejo primero", sortBy: 'id', sortOrder: 'asc' },
    { label: "Nombre A-Z", sortBy: 'name', sortOrder: 'asc' },
    { label: "Nombre Z-A", sortBy: 'name', sortOrder: 'desc' },
    { label: "Marca A-Z", sortBy: 'brand', sortOrder: 'asc' },
    { label: "Marca Z-A", sortBy: 'brand', sortOrder: 'desc' },
    { label: "País A-Z", sortBy: 'country', sortOrder: 'asc' },
    { label: "País Z-A", sortBy: 'country', sortOrder: 'desc' },
];

interface SortSelectorProps {
    sortBy: 'id' | 'name' | 'brand' | 'country';
    sortOrder: 'asc' | 'desc';
    onSort: (sortBy: 'id' | 'name' | 'brand' | 'country', sortOrder: 'asc' | 'desc') => void;
}

export default function SortSelector({ sortBy, sortOrder, onSort }: SortSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentOption = SORT_OPTIONS.find(
        (opt) => opt.sortBy === sortBy && opt.sortOrder === sortOrder
    ) || SORT_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
                <span className="text-xs font-mono text-white/70 uppercase tracking-wider">
                    {currentOption.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0a0b] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={`${option.sortBy}-${option.sortOrder}`}
                            onClick={() => {
                                onSort(option.sortBy, option.sortOrder);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-xs font-mono uppercase tracking-wider transition-colors ${option.sortBy === sortBy && option.sortOrder === sortOrder
                                    ? 'bg-accent/20 text-accent'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
