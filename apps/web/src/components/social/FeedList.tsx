import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSocialFeed } from "../../hooks/useSocialFeed";
import FeedItem from "./FeedItem";
import { Loader2 } from "lucide-react";

interface FeedListProps {
    tab: 'explore' | 'following';
    filters?: {
        type?: string;
        targetUserId?: number;
    };
}

export default function FeedList({ tab, filters = {} }: FeedListProps) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch
    } = useSocialFeed(tab, filters);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="flex flex-col divide-y divide-white/5">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex p-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 mr-3" />
                        <div className="flex-1 space-y-3">
                            <div className="h-2 w-24 bg-zinc-900 rounded" />
                            <div className="h-4 w-48 bg-zinc-900 rounded" />
                            <div className="h-20 w-full bg-zinc-900/50 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-16 text-center">
                <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-6">
                    [ Error de sincronización ]
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-2 border border-zinc-800 text-zinc-400 text-[10px] font-mono hover:text-white hover:border-zinc-600 transition-all uppercase tracking-widest"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const allItems = data?.pages.flatMap(page => page.items) || [];

    if (allItems.length === 0) {
        return (
            <div className="p-24 text-center">
                <p className="text-zinc-500 font-mono text-[11px] uppercase tracking-[0.4em]">
                    Silencio en el Mural
                </p>
                <p className="text-zinc-700 font-mono text-[9px] mt-4 tracking-widest uppercase max-w-xs mx-auto leading-relaxed">
                    {filters.targetUserId || filters.type
                        ? "No se encontró actividad para los filtros seleccionados."
                        : tab === 'following'
                            ? "Aún no sigues a nadie. Explora la red para encontrar otros coleccionistas."
                            : "No hay actividad reciente. ¡Sé el primero en compartir algo!"
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-white/5 bg-transparent">
            {allItems.map((item) => (
                <FeedItem key={item.id} item={item} />
            ))}

            <div ref={ref} className="h-24 flex items-center justify-center border-t border-white/5">
                {isFetchingNextPage ? (
                    <div className="flex items-center gap-3 text-zinc-600 font-mono text-[9px] tracking-[0.4em] uppercase">
                        <Loader2 className="w-3 h-3 animate-spin text-accent" />
                        Actualizando...
                    </div>
                ) : !hasNextPage && allItems.length > 0 && (
                    <div className="text-zinc-800 font-mono text-[9px] tracking-[0.5em] uppercase">
                        Fin de transmisión
                    </div>
                )}
            </div>
        </div>
    );
}
