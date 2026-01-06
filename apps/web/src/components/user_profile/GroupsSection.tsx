import { motion } from "framer-motion";
import { Folder, ChevronRight } from "lucide-react";

// Data hardcodeada -> a  reemplazar cuando esten los groups listos
const MOCK_GROUPS = [
    { id: 1, name: "JDM", count: 24, color: "from-red-500/20 to-red-600/10" },
    { id: 2, name: "Rojos", count: 15, color: "from-rose-500/20 to-rose-600/10" },
    { id: 3, name: "Clásicos", count: 31, color: "from-amber-500/20 to-amber-600/10" },
];

interface GroupsSectionProps {
    totalGroups: number;
    isOwner: boolean;
}

export default function GroupsSection({ totalGroups, isOwner }: GroupsSectionProps) {
    // Si no hay grupos no se renderiza la seccion
    if (totalGroups === 0 && !isOwner) {
        return null;
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                    <Folder className="w-5 h-5 text-accent" />
                    Grupos Destacados
                </h2>
                {MOCK_GROUPS.length > 0 && (
                    <button
                        disabled
                        className="text-sm text-accent/50 cursor-not-allowed flex items-center gap-1"
                    >
                        Ver todos
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {MOCK_GROUPS.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {MOCK_GROUPS.map((group) => (
                        <div
                            key={group.id}
                            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${group.color} border border-white/10 p-4 cursor-not-allowed opacity-60`}
                        >
                            <h3 className="text-white font-bold">{group.name}</h3>
                            <p className="text-white/60 text-sm mt-1">{group.count} autos</p>
                            <div className="absolute bottom-2 right-2 text-white/20">
                                <Folder className="w-8 h-8" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-white/40">
                    <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay grupos aún</p>
                    {isOwner && (
                        <button
                            disabled
                            className="mt-3 px-4 py-2 text-sm bg-white/10 text-white/50 rounded-lg cursor-not-allowed"
                        >
                            Crear grupo (próximamente)
                        </button>
                    )}
                </div>
            )}

            <p className="text-xs text-white/30 text-center mt-4 italic">
                * Los grupos son una funcionalidad próxima. Esto es solo una vista previa.
            </p>
        </motion.section>
    );
}
