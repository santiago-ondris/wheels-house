import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Folder, ChevronRight, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { listFeaturedGroups, GroupBasicInfo } from "../../services/group.service";

// Color variants for groups
const GROUP_COLORS = [
    "from-red-500/20 to-red-600/10",
    "from-rose-500/20 to-rose-600/10",
    "from-amber-500/20 to-amber-600/10",
    "from-emerald-500/20 to-emerald-600/10",
];

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
                    {featuredGroups.map((group, index) => (
                        <Link
                            key={group.groupId}
                            to={`/collection/${username}/group/${encodeURIComponent(group.name)}`}
                            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${GROUP_COLORS[index % GROUP_COLORS.length]} border border-white/10 p-4 hover:border-accent/50 hover:scale-[1.02] transition-all group`}
                        >
                            <h3 className="text-white font-bold truncate">{group.name}</h3>
                            <p className="text-white/60 text-sm mt-1">{group.totalCars} autos</p>
                            <div className="absolute bottom-2 right-2 text-white/20 group-hover:text-white/40 transition-colors">
                                <Folder className="w-8 h-8" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-white/40">
                    <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No hay grupos destacados</p>
                    {isOwner && (
                        <button
                            onClick={() => navigate("/collection/group/new")}
                            className="mt-3 px-4 py-2 text-sm bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
                        >
                            Crear mi primer grupo
                        </button>
                    )}
                </div>
            )}
        </motion.section>
    );
}

