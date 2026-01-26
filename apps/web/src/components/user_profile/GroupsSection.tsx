import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Folder, ChevronRight, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { listFeaturedGroups, GroupBasicInfo } from "../../services/group.service";
import { LikeButton } from "../../features/social/components/likes/LikeButton";


interface GroupsSectionProps {
    username: string;
    totalGroups: number;
    isOwner: boolean;
}

export default function GroupsSection({ username, totalGroups, isOwner }: GroupsSectionProps) {
    const navigate = useNavigate();
    const [featuredGroups, setFeaturedGroups] = useState<GroupBasicInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);

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
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
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
            <div
                className="flex items-center justify-between mb-4 cursor-pointer group/header select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 group-hover/header:text-accent transition-colors">
                        <Folder className="w-5 h-5 text-accent" />
                        Grupos Destacados
                    </h2>
                    <motion.div
                        animate={{ rotate: isExpanded ? 0 : -90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight className="w-5 h-5 text-white/50 group-hover/header:text-accent transition-colors" />
                    </motion.div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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

            <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className="pb-2">
                    {featuredGroups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {featuredGroups.map((group) => (
                                <Link
                                    key={group.groupId}
                                    to={`/collection/${username}/group/${encodeURIComponent(group.name)}`}
                                    className="blueprint-card block relative overflow-hidden group aspect-[3/1] rounded-xl border border-white/5 bg-white/[0.02]"
                                >
                                    {/* Background Image - using crop-friendly aspect ratio */}
                                    {group.picture && (
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={group.picture}
                                                alt={group.name}
                                                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent group-hover:via-black/30 transition-all duration-500" />
                                        </div>
                                    )}

                                    {/* Technical Details (Overlay) */}
                                    <div className="absolute inset-0 z-10 p-5 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 rounded-md">
                                                    <Folder className="w-4 h-4 stroke-[1.5]" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                                                        * Destacado *
                                                    </span>
                                                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
                                                        GRP-{String(group.groupId).padStart(4, '0')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Tech Lines Top Right */}
                                            <div className="relative w-8 h-8 opacity-50 hidden sm:block">
                                                <div className="absolute top-0 right-0 w-2 h-[1px] bg-white/30" />
                                                <div className="absolute top-0 right-0 w-[1px] h-2 bg-white/30" />
                                            </div>
                                        </div>



                                        <div className="space-y-1 max-w-[80%]">
                                            <h3 className="text-xl md:text-2xl font-mono font-black text-white truncate uppercase tracking-tighter group-hover:text-accent transition-colors drop-shadow-lg">
                                                {group.name}
                                            </h3>
                                            <div className="flex items-center gap-3 text-[11px] font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-white/40 uppercase">Total Items:</span>
                                                    <span className="text-white/80 font-bold bg-white/10 px-1.5 py-0.5 rounded">
                                                        {String(group.totalCars).padStart(3, '0')}
                                                    </span>
                                                </div>
                                                <div className="w-[1px] h-3 bg-white/20" />
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-white/40 uppercase">Likes:</span>
                                                    <LikeButton
                                                        id={group.groupId}
                                                        initialIsLiked={group.isLiked || false}
                                                        initialLikesCount={group.likesCount || 0}
                                                        type="group"
                                                        showCount={true}
                                                        className="p-0 hover:bg-transparent"
                                                    />
                                                </div>
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
                </div>
            </motion.div>
        </motion.section>
    );
}
