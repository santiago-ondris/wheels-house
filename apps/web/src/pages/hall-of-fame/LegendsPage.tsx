import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ArrowLeft, Car, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getHoFMembers, HallOfFameMember } from "../../services/profile.service";
import toast from "react-hot-toast";

const MEMBERS_PER_PAGE = 20;

export default function LegendsPage() {
    const navigate = useNavigate();
    const [members, setMembers] = useState<HallOfFameMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const data = await getHoFMembers('legends');
            setMembers(data);
        } catch (error) {
            console.error("Error fetching legends:", error);
            toast.error("No pudimos cargar las leyendas");
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(members.length / MEMBERS_PER_PAGE);
    const paginatedMembers = members.slice(
        (currentPage - 1) * MEMBERS_PER_PAGE,
        currentPage * MEMBERS_PER_PAGE
    );

    if (isLoading) {
        return (
            <div className="min-h-screen pb-20 bg-[#0a0a0b]">
                <header className="sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-xl animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
                                <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-[#0a0a0b]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/hall-of-fame')}
                            className="p-2 text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-mono font-bold text-white flex items-center gap-3 uppercase tracking-tighter">
                                <Star className="w-6 h-6 text-amber-400" />
                                Salón_Leyendas
                            </h1>
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                                ICONOS // MASTER COLLECTORS
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 md:py-12">
                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 border border-amber-400/20 bg-amber-400/5 rounded-2xl"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl">
                            <Trophy className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                        </div>
                        <div>
                            <h3 className="text-white font-mono font-bold text-sm uppercase tracking-tight mb-2">
                                ¿Quiénes son las Leyendas?
                            </h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Coleccionistas icónicos cuya trayectoria, calidad de piezas y conocimiento técnico trascienden el tiempo en Wheels House. 
                                <span className="text-amber-400 font-bold"> Solo para los más grandes</span>.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Search / Filters placeholder */}
                <div className="mb-10 h-px bg-white/5" />

                {/* Grid */}
                {members.length === 0 ? (
                    <div className="text-center py-20">
                        <Star className="w-16 h-16 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 text-lg font-mono">Próximamente las primeras leyendas</p>
                        <p className="text-white/20 text-sm mt-2">La historia está por escribirse.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 md:gap-4">
                            {paginatedMembers.map((member, index) => (
                                <motion.div
                                    key={member.userId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <Link
                                        to={`/collection/${member.username}`}
                                        className="group block p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-400/30 hover:bg-amber-400/5 transition-all duration-300"
                                    >
                                        {/* Avatar */}
                                        <div className="relative w-16 h-16 mx-auto mb-3">
                                            {member.picture ? (
                                                <img
                                                    src={member.picture}
                                                    alt={member.username}
                                                    className="w-full h-full rounded-full object-cover border-2 border-white/10 group-hover:border-amber-400/40 transition-colors"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/30 border-2 border-white/10 group-hover:border-amber-400/40 flex items-center justify-center text-white font-bold text-xl transition-colors">
                                                    {member.firstName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Username */}
                                        <p className="text-white font-mono font-bold text-xs text-center truncate group-hover:text-amber-400 transition-colors">
                                            @{member.username}
                                        </p>

                                        {/* Title or Name */}
                                        <p className="text-amber-400/60 text-[10px] text-center font-mono uppercase tracking-tighter truncate mt-1">
                                            {member.hallOfFameTitle || "Leyenda"}
                                        </p>

                                        {/* Car Count */}
                                        <div className="flex items-center justify-center gap-1 mt-3 text-amber-400/70">
                                            <Car className="w-3 h-3" />
                                            <span className="text-[10px] font-mono font-bold">
                                                {member.carCount}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-white" />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-sm font-mono font-bold transition-colors ${currentPage === i + 1
                                                    ? 'bg-amber-400 text-black'
                                                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
