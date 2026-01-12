import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const LIMIT_OPTIONS = [15, 30, 50];

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    limit,
    onPageChange,
    onLimitChange,
}: PaginationProps) {
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalItems);

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | '...')[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push('...');

            if (!pages.includes(totalPages)) pages.push(totalPages);
        }

        return pages;
    };

    if (totalItems === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
            {/* Items per page & info */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                        Por página:
                    </span>
                    <div className="flex gap-1">
                        {LIMIT_OPTIONS.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => onLimitChange(opt)}
                                className={`px-2 py-1 text-xs font-mono rounded transition-colors ${limit === opt
                                        ? 'bg-accent text-white'
                                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider hidden sm:inline">
                    {startItem}-{endItem} de {totalItems}
                </span>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-white/30 font-mono text-xs">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 text-xs font-mono rounded transition-colors ${currentPage === page
                                    ? 'bg-accent text-white'
                                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
