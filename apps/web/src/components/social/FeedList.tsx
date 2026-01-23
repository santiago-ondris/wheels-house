import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSocialFeed } from "../../hooks/useSocialFeed";
import FeedItem from "./FeedItem";
import { Loader2 } from "lucide-react";

interface FeedListProps {
    tab: 'explore' | 'following';
}

export default function FeedList({ tab }: FeedListProps) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch
    } = useSocialFeed(tab);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-px bg-zinc-800/20">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 w-full bg-zinc-900/50 animate-pulse border border-zinc-800" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-10 text-center border border-zinc-800 bg-zinc-900/20">
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mb-4">
                    [ ERROR_CARGANDO_ACTIVIDAD ]
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-zinc-800 text-white text-xs font-mono uppercase tracking-widest hover:bg-zinc-700 transition-colors"
                >
                    REINTENTAR
                </button>
            </div>
        );
    }

    const allItems = data?.pages.flatMap(page => page.items) || [];

    if (allItems.length === 0) {
        return (
            <div className="p-20 text-center border border-zinc-800 bg-zinc-900/20">
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.2em]">
                    -- SIN ACTIVIDAD RECIENTE --
                </p>
                {tab === 'following' && (
                    <p className="text-zinc-600 font-mono text-[10px] mt-2 tracking-widest uppercase">
                        SEGUÍ A OTROS COLECCIONISTAS PARA VER SUS NOVEDADES
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-px bg-zinc-800/20">
            {allItems.map((item) => (
                <FeedItem key={item.id} item={item} />
            ))}

            <div ref={ref} className="h-10 flex items-center justify-center p-8">
                {isFetchingNextPage && (
                    <div className="flex items-center gap-3 text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase">
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        CARGANDO_MÁS
                    </div>
                )}
                {!hasNextPage && allItems.length > 0 && (
                    <div className="text-zinc-600/40 font-mono text-[10px] tracking-[0.5em] uppercase">
                        [ FIN_DE_LA_ACTIVIDAD ]
                    </div>
                )}
            </div>
        </div>
    );
}
