import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Folder, Plus, ChevronRight } from "lucide-react";
import { listGroups, GroupBasicInfo } from "../../services/group.service";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import toast from "react-hot-toast";

export default function GroupsListPage() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [groups, setGroups] = useState<GroupBasicInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isOwner = user?.username === username;

    // ScrollRestoration handles scroll automatically
    useEffect(() => {
        if (username) {
            fetchGroups();
        }
    }, [username]);

    const fetchGroups = async () => {
        try {
            const data = await listGroups(username!);
            setGroups(data);
        } catch (error) {
            console.error("Error fetching groups:", error);
            toast.error("Error al cargar los grupos");
        } finally {
            setIsLoading(false);
        }
    };

    // Always navigate to user profile (not browser history to avoid loops)
    const handleBack = () => navigate(`/collection/${username}`);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Cargando...
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-8">
            {/* Header */}
            <PageHeader
                title="Grupos"
                subtitle={`@${username} // ${groups.length} ${groups.length === 1 ? 'grupo' : 'grupos'}`}
                icon={Folder}
                onBack={handleBack}
                actions={
                    isOwner ? (
                        <button
                            onClick={() => navigate("/collection/group/new")}
                            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:inline">Crear</span>
                        </button>
                    ) : undefined
                }
            />

            {/* Groups Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="container mx-auto px-4 py-6"
            >
                {groups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groups.map((group, index) => (
                            <motion.div
                                key={group.groupId}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/collection/${username}/group/${encodeURIComponent(group.name)}`}
                                    className="blueprint-card block relative overflow-hidden group aspect-[3/1] rounded-xl border border-white/5 bg-white/[0.02]"
                                >
                                    {/* Background Image - using crop-friendly aspect ratio */}
                                    {group.picture && (
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={group.picture}
                                                alt={group.name}
                                                className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent group-hover:via-black/30 transition-all duration-500" />
                                        </div>
                                    )}

                                    {/* Technical Details (Overlay) */}
                                    <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 rounded-md relative group/icon">
                                                    <Folder className="w-5 h-5 stroke-[1.5]" />
                                                    <div className="absolute -inset-1 border border-white/5 scale-110 opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={group.featured ? "text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider" : "text-[10px] font-mono text-white/30 uppercase tracking-wider"}>
                                                        {group.featured ? "* DESTACADO *" : "STATUS: OK"}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
                                                        REF: GRP-{String(group.groupId).padStart(4, '0')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Tech Lines Top Right */}
                                            <div className="relative w-8 h-8 opacity-50">
                                                <div className="absolute top-0 right-0 w-3 h-[1px] bg-white/50" />
                                                <div className="absolute top-0 right-0 w-[1px] h-3 bg-white/50" />
                                            </div>
                                        </div>

                                        <div className="max-w-[85%]">
                                            <h3 className="text-2xl md:text-3xl font-mono font-black text-white truncate uppercase tracking-tighter group-hover:text-accent transition-colors drop-shadow-lg mb-2">
                                                {group.name}
                                            </h3>

                                            <div className="flex items-center gap-4 text-[11px] font-mono border-t border-white/10 pt-2 w-fit">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white/40 uppercase">Total Items:</span>
                                                    <span className="text-white/90 font-bold bg-white/10 px-2 py-0.5 rounded">
                                                        {String(group.totalCars).padStart(3, '0')}
                                                    </span>
                                                </div>
                                                <div className="w-[1px] h-3 bg-white/20" />
                                                <div className="flex items-center gap-1 text-white/40 group-hover:text-accent/80 transition-colors">
                                                    <span>VER DETALLES</span>
                                                    <ChevronRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-blueprint/10 rounded-sm bg-blueprint/[0.01]">
                        <Folder className="w-12 h-12 mx-auto mb-4 text-blueprint/20 stroke-[1]" />
                        <p className="text-sm font-mono text-blueprint/40 mb-4 tracking-widest uppercase">No se encontraron grupos</p>
                        {isOwner && (
                            <button
                                onClick={() => navigate("/collection/group/new")}
                                className="px-6 py-2 border border-blueprint/30 text-blueprint/60 font-mono text-xs hover:bg-blueprint/10 transition-colors uppercase tracking-widest"
                            >
                                Crear nuevo grupo
                            </button>
                        )}
                    </div>

                )}

            </motion.div>


        </div>
    );
}
