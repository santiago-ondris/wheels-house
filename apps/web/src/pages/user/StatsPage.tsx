import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    BarChart3,
    Car,
    Layers,
    Globe,
    Info
} from "lucide-react";
import { getUserStats, UserStats } from "../../services/profile.service";
import StatsCard from "../../components/user_profile/stats/StatsCard";
import DistributionSection from "../../components/user_profile/stats/DistributionSection";
import { colorMap } from "../../data/carOptions";
import toast from "react-hot-toast";

export default function StatsPage() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!username) return;
            try {
                const data = await getUserStats(username);
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
                toast.error("No pudimos cargar las estadísticas");
                navigate(`/collection/${username}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [username, navigate]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <div className="animate-pulse space-y-8">
                    <div className="h-10 w-48 bg-white/5 rounded-lg" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-white/5 rounded-2xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-64 bg-white/5 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="min-h-screen pb-20 bg-[#0a0a0b]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/collection/${username}`)}
                            className="p-2 text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-mono font-bold text-white flex items-center gap-3 uppercase tracking-tighter">
                                <BarChart3 className="w-6 h-6 text-accent" />
                                Estadísticas_Colección
                            </h1>
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                                USUARIO: @{username} // Estado: Online
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                {/* Summary HUD */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-20 border-y border-white/5 bg-white/[0.01]">
                    <StatsCard
                        label="Total Autos"
                        subLabel="CONTADOR"
                        value={stats.totalCars.toString().padStart(3, '0')}
                        icon={Car}
                        index={0}
                    />
                    <StatsCard
                        label="Marcas Únicas"
                        subLabel="DIVERSIDAD_MARCAS"
                        value={stats.distinctBrands.toString().padStart(2, '0')}
                        icon={Layers}
                        index={1}
                    />
                    <StatsCard
                        label="Nac. Favorita"
                        subLabel="PAÍS FAVORITO"
                        value={stats.favoriteNationality?.substring(0, 3).toUpperCase() || "---"}
                        icon={Globe}
                        index={2}
                    />
                    <StatsCard
                        label="Total Fotos"
                        subLabel="GALERÍA"
                        value={stats.totalPhotos.toString().padStart(3, '0')}
                        icon={Layers}
                        index={3}
                        showDivider={false}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Distributions */}
                    <DistributionSection
                        title="Top_Marcas"
                        subTitle="PRIMERA_ANALÍTICA"
                        items={stats.brandDistribution}
                        total={stats.totalCars}
                        colorClass="bg-accent"
                    />

                    <DistributionSection
                        title="Top_Fabricantes"
                        subTitle="SEGUNDA_ANALÍTICA"
                        items={stats.manufacturerDistribution}
                        total={stats.totalCars}
                        colorClass="bg-blue-500"
                    />

                    <DistributionSection
                        title="Top_Escala"
                        subTitle="TERCERA_ANALÍTICA"
                        items={stats.scaleDistribution}
                        total={stats.totalCars}
                        colorClass="bg-emerald-500"
                    />

                    <DistributionSection
                        title="Top_Condición"
                        subTitle="CUARTA_ANALÍTICA"
                        items={stats.conditionDistribution}
                        total={stats.totalCars}
                        colorClass="bg-amber-500"
                    />
                </div>

                {/* Overlapping Paint Chips */}
                <div className="mt-20 pt-10 border-t border-white/5">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <span className="text-[10px] text-accent/50 font-bold uppercase tracking-[0.2em]">
                                ESPECTRO DE COLORES
                            </span>
                            <h3 className="text-white font-mono font-bold text-2xl uppercase tracking-tight">
                                Chip_Pinturas_Favoritas
                            </h3>
                        </div>
                        <p className="text-white/20 text-[10px] font-mono leading-relaxed max-w-xs md:text-right">
                            Distribución cromática de la colección basada en metadatos de fábrica.
                        </p>
                    </div>

                    {/* Desktop View: Overlapping Paint Chips */}
                    <div className="hidden md:flex items-center justify-start py-10 overflow-x-auto no-scrollbar">
                        <div className="flex pl-10">
                            {stats.colorDistribution.map((item, idx) => {
                                const hexColor = colorMap[item.name] || '#444';

                                return (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative group -ml-8 first:ml-0"
                                    >
                                        <div
                                            className="w-28 h-28 rounded-full shadow-[5px_5px_20px_rgba(0,0,0,0.4)] border border-white/10 transition-transform duration-300 group-hover:-translate-y-4 group-hover:scale-110 cursor-help"
                                            style={{
                                                background: `radial-gradient(circle at 35% 35%, ${hexColor}, #000 95%)`,
                                                zIndex: stats.colorDistribution.length - idx
                                            }}
                                        >
                                            {/* Metallic specularity */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                                        </div>

                                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 transition-opacity pointer-events-none whitespace-nowrap">
                                            <p className="text-[10px] font-mono font-bold text-white/50 px-2 py-1 rounded group-hover:text-white transition-colors">
                                                {item.name}: {item.count}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile View: Vertical List */}
                    <div className="flex md:hidden flex-col gap-4 mt-6">
                        {stats.colorDistribution.map((item, idx) => {
                            const hexColor = colorMap[item.name] || '#444';
                            return (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-xl"
                                >
                                    <div
                                        className="w-10 h-10 rounded-full border border-white/10 shadow-lg"
                                        style={{
                                            background: `radial-gradient(circle at 35% 35%, ${hexColor}, #000 95%)`
                                        }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                                {item.name}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-accent">
                                                {item.count} UNIDADES
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1 mt-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.count / stats.totalCars) * 100}%` }}
                                                className="h-full bg-accent"
                                                transition={{ duration: 1, delay: idx * 0.1 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-20 p-8 border border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center gap-8">
                    <div className="p-4 bg-accent/10 border border-accent/20 rounded-full">
                        <Info className="w-8 h-8 text-accent/50" />
                    </div>
                    <div>
                        <h4 className="text-white font-mono font-bold text-lg uppercase tracking-tight">Notificación del Sistema: Características Futuras</h4>
                        <p className="text-white/30 font-mono text-xs mt-2 uppercase tracking-wide">
                            CUALQUIER ESTADÍSTICA DESEADA QUE NO ESTÉ, PONERSE EN CONTACTO PARA SOLICITARLA.
                        </p>
                        <p className="text-white/40 text-[10px] mt-4 leading-relaxed italic">
                            "Colecciona más rápido, analiza más profundo. El sistema está aún evolucionando."
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
