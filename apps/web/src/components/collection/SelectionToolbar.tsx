import { motion } from "framer-motion";
import { X, CheckSquare, Square, FolderPlus } from "lucide-react";

interface SelectionToolbarProps {
    selectedCount: number;
    totalItems: number;
    selectAllMode: 'page' | 'all' | null;
    isPageFullySelected: boolean;
    onSelectPage: () => void;
    onSelectAll: () => void;
    onClear: () => void;
    onAddToGroup: () => void;
}

export default function SelectionToolbar({
    selectedCount,
    totalItems,
    selectAllMode,
    isPageFullySelected,
    onSelectPage,
    onSelectAll,
    onClear,
    onAddToGroup,
}: SelectionToolbarProps) {
    if (selectedCount === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#0a0a0b] border border-accent/30 rounded-xl shadow-2xl shadow-accent/10 px-4 py-3 flex items-center gap-3 sm:gap-4"
        >
            {/* Selection count */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-mono font-bold text-accent">
                        {selectedCount}
                    </span>
                </div>
                <span className="text-xs font-mono text-white/60 uppercase tracking-wider hidden sm:block">
                    {selectAllMode === 'all' ? 'Todos seleccionados' : 'Seleccionados'}
                </span>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/10" />

            {/* Selection actions */}
            <div className="flex items-center gap-1">
                {!isPageFullySelected && selectAllMode !== 'page' && (
                    <button
                        onClick={onSelectPage}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Página</span>
                    </button>
                )}

                {selectAllMode !== 'all' && totalItems > selectedCount && (
                    <button
                        onClick={onSelectAll}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-accent hover:bg-accent/10 rounded-lg transition-colors"
                    >
                        <Square className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Todos ({totalItems})</span>
                        <span className="sm:hidden">{totalItems}</span>
                    </button>
                )}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/10" />

            {/* Action buttons */}
            <button
                onClick={onAddToGroup}
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
                <FolderPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Añadir a Grupo</span>
                <span className="sm:hidden">Grupo</span>
            </button>

            {/* Clear button */}
            <button
                onClick={onClear}
                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
