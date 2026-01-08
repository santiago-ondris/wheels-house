import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Folder, Plus, Star, ChevronRight } from "lucide-react";
import { listGroups, GroupBasicInfo } from "../../services/group.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

export default function GroupsListPage() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [groups, setGroups] = useState<GroupBasicInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isOwner = user?.username === username;

    useEffect(() => {
        window.scrollTo(0, 0);
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

    const handleBack = () => {
        navigate(-1);
    };

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
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-white/5"
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 text-white/60 hover:text-white transition-colors rounded-xl hover:bg-white/5 active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl md:text-2xl font-bold text-white">
                                Grupos
                            </h1>
                            <p className="text-white/40 text-xs md:text-sm">
                                <Link to={`/collection/${username}`} className="hover:text-accent transition-colors">
                                    @{username}
                                </Link>
                                {" · "}
                                {groups.length} {groups.length === 1 ? "grupo" : "grupos"}
                            </p>
                        </div>
                        {isOwner && (
                            <button
                                onClick={() => navigate("/collection/group/new")}
                                className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/80 text-white font-bold rounded-xl transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden md:inline">Crear Grupo</span>
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Groups List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="container mx-auto px-4 py-6"
            >
                {groups.length > 0 ? (
                    <div className="space-y-3">
                        {groups.map((group) => (
                            <Link
                                key={group.groupId}
                                to={`/collection/${username}/group/${encodeURIComponent(group.name)}`}
                                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-accent/30 hover:bg-white/[0.04] transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent transition-colors">
                                    <Folder className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white font-bold truncate">{group.name}</h3>
                                        {group.featured && (
                                            <Star className="w-4 h-4 text-accent fill-accent flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-white/40 text-sm">
                                        {group.totalCars} {group.totalCars === 1 ? "auto" : "autos"}
                                        {group.description && ` · ${group.description}`}
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-accent transition-colors" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-white/40">
                        <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">No hay grupos aún</p>
                        {isOwner && (
                            <>
                                <p className="text-sm mb-4">Creá tu primer grupo para organizar tus autos</p>
                                <button
                                    onClick={() => navigate("/collection/group/new")}
                                    className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/80 transition-colors"
                                >
                                    Crear mi primer grupo
                                </button>
                            </>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
