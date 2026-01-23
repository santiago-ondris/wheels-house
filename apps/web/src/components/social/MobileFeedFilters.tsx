import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Filter, Info } from "lucide-react";
import FeedUserSearch from "./FeedUserSearch";

interface MobileFeedFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    activeType: string;
    setSelectedType: (type: string) => void;
    selectedUser: { userId: number, username: string } | null;
    setSelectedUser: (user: { userId: number, username: string } | null) => void;
}

export default function MobileFeedFilters({
    isOpen,
    onClose,
    activeType,
    setSelectedType,
    selectedUser,
    setSelectedUser,
}: MobileFeedFiltersProps) {
    const contentTypes = [
        { id: "all", label: "Todo" },
        { id: "car_added", label: "Autos agregados" },
        { id: "group_created", label: "Grupos nuevos" },
        { id: "wishlist_achieved", label: "Wishlist conseguidos" },
        { id: "milestone_reached", label: "Logros" },
    ];

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="flex min-h-full items-end justify-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300 transform"
                            enterFrom="translate-y-full"
                            enterTo="translate-y-0"
                            leave="ease-in duration-200 transform"
                            leaveFrom="translate-y-0"
                            leaveTo="translate-y-full"
                        >
                            <Dialog.Panel className="w-full max-w-lg bg-[#0a0a0a] border-t border-white/10 rounded-t-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
                                {/* Drag Handle */}
                                <div className="flex justify-center pt-4 pb-2" onClick={onClose}>
                                    <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
                                </div>

                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-accent/10 rounded-xl">
                                            <Filter className="w-4 h-4 text-accent" />
                                        </div>
                                        <Dialog.Title className="text-lg font-black uppercase tracking-widest text-white">
                                            Filtros
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/5"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">
                                    {/* User Search */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">
                                            Filtrar por usuario
                                        </p>
                                        <FeedUserSearch 
                                            selectedUser={selectedUser}
                                            onSelectUser={(user) => {
                                                setSelectedUser(user);
                                                // Optional: keep open if searching, or close if selected
                                            }}
                                        />
                                    </div>

                                    {/* Content Type */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">
                                            Tipo de contenido
                                        </p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {contentTypes.map((type) => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all active:scale-[0.98] ${
                                                        activeType === type.id 
                                                            ? "bg-accent/10 text-white border border-accent/20" 
                                                            : "bg-white/5 text-zinc-400 border border-transparent"
                                                    }`}
                                                >
                                                    <span className="text-sm font-bold">{type.label}</span>
                                                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                        activeType === type.id 
                                                            ? "bg-accent scale-100 shadow-[0_0_10px_rgba(255,255,255,0.4)]" 
                                                            : "bg-zinc-800 scale-75"
                                                    }`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Discovery Placeholder */}
                                    <div className="bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 rounded-3xl p-6 space-y-4">
                                        <div className="flex items-center gap-3 text-accent">
                                            <Info className="w-5 h-5" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                                Próximamente
                                            </p>
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed italic">
                                            "Estamos preparando estadísticas en tiempo real y tendencias para que no te pierdas nada importante."
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Action */}
                                <div className="p-6 bg-[#0a0a0a] border-t border-white/5 mt-auto">
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-accent/20"
                                    >
                                        Ver Resultados
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
