import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Car, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getFounders, Founder } from "../../services/profile.service";
import toast from "react-hot-toast";

const FOUNDERS_PER_PAGE = 20;
const TOTAL_FOUNDERS_LIMIT = 100;

export default function FoundersPage() {
    const navigate = useNavigate();
    const [founders, setFounders] = useState<Founder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const founderRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchFounders();
    }, []);

    const fetchFounders = async () => {
        try {
            const data = await getFounders();
            setFounders(data);
        } catch (error) {
            console.error("Error fetching founders:", error);
            toast.error("No pudimos cargar los fundadores");
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(founders.length / FOUNDERS_PER_PAGE);
    const paginatedFounders = founders.slice(
        (currentPage - 1) * FOUNDERS_PER_PAGE,
        currentPage * FOUNDERS_PER_PAGE
    );

    const progressPercentage = Math.min((founders.length / TOTAL_FOUNDERS_LIMIT) * 100, 100);

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
                                <Users className="w-6 h-6 text-sky-400" />
                                Salón_Fundadores
                            </h1>
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                                PRIMEROS 100 // Activo desde Enero 2026
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
                    className="mb-8 p-6 border border-sky-400/20 bg-sky-400/5 rounded-2xl"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-sky-400/10 border border-sky-400/20 rounded-xl">
                            <Info className="w-5 h-5 text-sky-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-mono font-bold text-sm uppercase tracking-tight mb-2">
                                ¿Cómo estar en el Salón de Fundadores?
                            </h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Los primeros <span className="text-sky-400 font-bold">100 usuarios</span> que registren al menos un auto en su colección se graban para siempre en este muro.
                                Sé parte del inicio de Wheels House.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Progress Bar & Search */}
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    {/* Progress */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-sky-400/50 font-bold uppercase tracking-[0.2em]">
                                Progreso del Salón
                            </span>
                            <span className="text-sm font-mono font-bold text-sky-400">
                                {founders.length.toString().padStart(3, '0')}/{TOTAL_FOUNDERS_LIMIT}
                            </span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-sky-500 to-sky-400"
                            />
                        </div>
                        <p className="text-white/20 text-[10px] font-mono mt-2">
                            {TOTAL_FOUNDERS_LIMIT - founders.length > 0
                                ? `${TOTAL_FOUNDERS_LIMIT - founders.length} lugares restantes`
                                : "Salón Completo"}
                        </p>
                    </div>
                </div>

                {/* Founders Grid */}
                {founders.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-16 h-16 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 text-lg font-mono">Sin fundadores aún</p>
                        <p className="text-white/20 text-sm mt-2">¡Sé el primero en registrar un auto!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 md:gap-4">
                            {paginatedFounders.map((founder, index) => (
                                <motion.div
                                    key={founder.userId}
                                    ref={(el) => {
                                        if (el) founderRefs.current.set(founder.founderNumber, el);
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <Link
                                        to={`/collection/${founder.username}`}
                                        className="group block p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-sky-400/30 hover:bg-sky-400/5 transition-all duration-300"
                                    >
                                        {/* Founder Number */}
                                        <div className="text-[10px] font-mono font-bold text-sky-400/60 mb-3">
                                            #{founder.founderNumber.toString().padStart(3, '0')}
                                        </div>

                                        {/* Avatar */}
                                        <div className="relative w-16 h-16 mx-auto mb-3">
                                            {founder.picture ? (
                                                <img
                                                    src={founder.picture}
                                                    alt={founder.username}
                                                    className="w-full h-full rounded-full object-cover border-2 border-white/10 group-hover:border-sky-400/40 transition-colors"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-gradient-to-br from-sky-500/30 to-sky-600/30 border-2 border-white/10 group-hover:border-sky-400/40 flex items-center justify-center text-white font-bold text-xl transition-colors">
                                                    {founder.firstName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Username */}
                                        <p className="text-white font-mono font-bold text-xs text-center truncate group-hover:text-sky-400 transition-colors">
                                            @{founder.username}
                                        </p>

                                        {/* Name */}
                                        <p className="text-white/40 text-[10px] text-center truncate mt-1">
                                            {founder.firstName} {founder.lastName}
                                        </p>

                                        {/* Car Count */}
                                        <div className="flex items-center justify-center gap-1 mt-3 text-sky-400/70">
                                            <Car className="w-3 h-3" />
                                            <span className="text-[10px] font-mono font-bold">
                                                {founder.carCount}
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
                                                    ? 'bg-sky-400 text-black'
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
