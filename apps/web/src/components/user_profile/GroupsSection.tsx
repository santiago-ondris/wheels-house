import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Folder, ChevronRight, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { listFeaturedGroups, GroupBasicInfo } from "../../services/group.service";

interface GroupsSectionProps {
    username: string;
    totalGroups: number;
    isOwner: boolean;
}

export default function GroupsSection({ username, totalGroups, isOwner }: GroupsSectionProps) {
    const navigate = useNavigate();
    const [featuredGroups, setFeaturedGroups] = useState<GroupBasicInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (username) {
            fetchFeaturedGroups();
        }
    }, [username]);

    const fetchFeaturedGroups = async () => {
        try {
            const groups = await listFeaturedGroups(username);
            setFeaturedGroups(groups);
        } catch (error) {
            console.error("Error fetching featured groups:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render if no groups and not owner
    if (totalGroups === 0 && !isOwner) {
        return null;
    }

    // Loading state
    if (isLoading) {
        return (
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Folder className="w-5 h-5 text-accent" />
                    <h2 className="text-lg md:text-xl font-bold text-white">Grupos Destacados</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </motion.section>
        );
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
                <div className="flex items-center gap-2">
                    {isOwner && (
                        <button
                            onClick={() => navigate("/collection/group/new")}
                            className="text-sm text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:inline">Crear</span>
                        </button>
                    )}
                    {(totalGroups > 0 || featuredGroups.length > 0) && (
                        <Link
                            to={`/collection/${username}/groups`}
                            className="text-sm text-emerald-400/80 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                        >
                            Ver todos
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>

            {featuredGroups.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {featuredGroups.map((group) => (
                        <Link
                            key={group.groupId}
                            to={`/collection/${username}/group/${encodeURIComponent(group.name)}`}
                            className="blueprint-card block p-4 group"
                        >
                            {/* Technical Corner Detail */}
                            <div className="blueprint-line top-0 right-6 w-[1px] h-2" />
                            <div className="blueprint-line top-4 right-0 w-2 h-[1px]" />

                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                    <div className="w-8 h-8 border border-blueprint/20 flex items-center justify-center text-blueprint/30">
                                        <Folder className="w-4 h-4 stroke-[1.5]" />
                                    </div>
                                    <span className="text-[14px] font-mono text-blueprint/40 uppercase tracking-tighter text-right">
                                        GRP-{String(group.groupId).padStart(4, '0')}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-mono font-bold text-white truncate uppercase tracking-tight group-hover:text-blueprint transition-colors">
                                        {group.name}
                                    </h3>
                                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                                        * Destacado *
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-blueprint/10 text-[12px] font-mono">
                                        <span className="text-blueprint/20 truncate mr-2 uppercase">Cantidad:</span>
                                        <span className="text-blueprint/60 flex-shrink-0">
                                            [{String(group.totalCars).padStart(3, '0')} AUTOS]
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-white/40 border border-dashed border-blueprint/10 rounded-xl bg-blueprint/[0.01]">
                    <Folder className="w-12 h-12 mx-auto mb-2 opacity-30 text-blueprint" />
                    <p className="text-sm font-mono uppercase tracking-wider">No hay grupos destacados</p>
                    {isOwner && (
                        <button
                            onClick={() => navigate("/collection/group/new")}
                            className="mt-3 px-4 py-2 text-xs font-mono border border-blueprint/30 text-blueprint/60 hover:bg-blueprint/10 transition-colors uppercase tracking-widest"
                        >
                            Crear mi primer grupo
                        </button>
                    )}
                </div>
            )}

        </motion.section>
    );
}


