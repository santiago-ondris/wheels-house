import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Folder, Plus, ChevronRight } from "lucide-react";
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

            {/* Groups Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="container mx-auto px-4 py-6"
            >
                {groups.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {groups.map((group, index) => (
                            <motion.div
                                key={group.groupId}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/collection/${username}/group/${encodeURIComponent(group.name)}`}
                                    className="blueprint-card block h-full group"
                                >
                                    {/* Decorative Technical Lines */}
                                    <div className="blueprint-line top-0 left-10 w-[1px] h-4" />
                                    <div className="blueprint-line top-10 left-0 w-4 h-[1px]" />
                                    <div className="blueprint-line bottom-0 right-10 w-[1px] h-4" />
                                    <div className="blueprint-line bottom-10 right-0 w-4 h-[1px]" />

                                    {/* Blueprint Stamp */}
                                    {group.featured && (
                                        <div className="blueprint-stamp">
                                            SPEC: APPROVED
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col h-full gap-6">
                                        {/* Header Part */}
                                        <div className="flex items-start justify-between">
                                            <div className="relative">
                                                <div className="w-12 h-12 border border-blueprint/30 flex items-center justify-center text-blueprint/40 relative">
                                                    <Folder className="w-6 h-6 stroke-[1.5]" />
                                                    {/* Dimension lines for icon */}
                                                    <div className="absolute -left-2 top-0 bottom-0 w-[1px] bg-blueprint/20" />
                                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-[8px] font-mono -rotate-90 origin-center text-blueprint/20">48mm</div>
                                                </div>
                                            </div>
                                            <div className="text-right font-mono">
                                                <p className="text-[9px] text-blueprint/30 uppercase">Ref. Code</p>
                                                <p className="text-[10px] text-blueprint/60 font-bold">GRP-{String(group.groupId).padStart(4, '0')}</p>
                                            </div>
                                        </div>

                                        {/* Main Content */}
                                        <div className="flex-1 space-y-4">
                                            <h3 className="text-xl md:text-2xl font-mono font-black text-white leading-tight break-words uppercase tracking-tighter group-hover:text-blueprint transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                                {group.name}
                                            </h3>

                                            <div className="space-y-1.5 pt-3 border-t border-blueprint/10">
                                                <div className="flex justify-between items-center text-[10px] font-mono">
                                                    <span className="text-blueprint/30">STATUS:</span>
                                                    <span className="text-blueprint/60">FUNCIONANDO</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-mono">
                                                    <span className="text-blueprint/30">CANTIDAD:</span>
                                                    <span className="text-white/80 p-0.5 border border-blueprint/20 bg-blueprint/5">
                                                        [ {String(group.totalCars).padStart(3, '0')} AUTOS ]
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Decorative */}
                                        <div className="flex items-center justify-between pt-2 border-t border-blueprint/10 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <div className="flex gap-2">
                                                <div className="w-10 h-[2px] bg-blueprint/20" />
                                                <div className="w-3 h-[2px] bg-blueprint/20" />
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-blueprint group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-blueprint/10 rounded-sm bg-blueprint/[0.01]">
                        <Folder className="w-12 h-12 mx-auto mb-4 text-blueprint/20 stroke-[1]" />
                        <p className="text-sm font-mono text-blueprint/40 mb-4 tracking-widest uppercase">No data clusters found</p>
                        {isOwner && (
                            <button
                                onClick={() => navigate("/collection/group/new")}
                                className="px-6 py-2 border border-blueprint/30 text-blueprint/60 font-mono text-xs hover:bg-blueprint/10 transition-colors uppercase tracking-widest"
                            >
                                Initialise New Build
                            </button>
                        )}
                    </div>

                )}

            </motion.div>


        </div>
    );
}
