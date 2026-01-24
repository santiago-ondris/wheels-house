import { Info } from "lucide-react";
import FeedUserSearch from "./FeedUserSearch";

interface RightSidebarProps {
    activeType: string;
    setSelectedType: (type: string) => void;
    selectedUser: { userId: number, username: string } | null;
    setSelectedUser: (user: { userId: number, username: string } | null) => void;
}

export default function RightSidebar({ 
    activeType, 
    setSelectedType, 
    selectedUser, 
    setSelectedUser 
}: RightSidebarProps) {
    const contentTypes = [
        { id: "all", label: "Todo" },
        { id: "car_added", label: "Autos agregados" },
        { id: "group_created", label: "Grupos nuevos" },
        { id: "wishlist_achieved", label: "Wishlist conseguidos" },
        { id: "milestone_reached", label: "Logros" },
    ];

    return (
        <aside className="w-full flex flex-col gap-8 py-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar pl-4">
            {/* Search - Replaced with UserSearch for filtering */}
            <div className="flex flex-col gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">
                    Buscar Usuario
                </p>
                <FeedUserSearch 
                    selectedUser={selectedUser}
                    onSelectUser={setSelectedUser}
                />
            </div>

            {/* Content Type Filter */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Filtrar por tipo
                </p>
                <div className="flex flex-col gap-1">
                    {contentTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                                activeType === type.id 
                                    ? "bg-accent/10 text-white" 
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                            }`}
                        >
                            <span className="text-xs font-bold tracking-tight">{type.label}</span>
                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                activeType === type.id 
                                    ? "bg-accent scale-100 shadow-[0_0_10px_rgba(255,255,255,0.4)]" 
                                    : "bg-zinc-800 scale-75"
                            }`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Activity Stats Placeholder - Promoted position */}
            <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/10 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-accent">
                    <div className="p-2 bg-accent/20 rounded-lg">
                        <Info className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Descubrimiento
                    </p>
                </div>
                <div className="space-y-3">
                    <p className="text-[11px] font-medium text-zinc-400 leading-relaxed italic">
                        Próximamente: Estadísticas globales y tendencias en tiempo real.
                    </p>
                    <div className="h-px bg-white/5 w-1/2" />
                    <p className="text-[10px] text-zinc-600 leading-relaxed">
                        Estamos construyendo herramientas para ayudarte a encontrar otras colecciones de la comunidad.
                    </p>
                </div>
            </div>
        </aside>
    );
}
