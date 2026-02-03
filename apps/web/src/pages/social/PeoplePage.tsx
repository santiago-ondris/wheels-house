import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFollowers, getFollowing } from "../../features/social/api/followsApi";
import UserCard from "../../features/social/components/UserCard";
import { Users, UserPlus, Loader2, ArrowLeft, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PeoplePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>('following');
    const [searchQuery, setSearchQuery] = useState("");
    const queryClient = useQueryClient();

    const { data: followers, isLoading: loadingFollowers } = useQuery({
        queryKey: ['followers', user?.userId],
        queryFn: () => getFollowers(user!.userId),
        enabled: !!user?.userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { data: following, isLoading: loadingFollowing } = useQuery({
        queryKey: ['following', user?.userId],
        queryFn: () => getFollowing(user!.userId),
        enabled: !!user?.userId,
        staleTime: 1000 * 60 * 5,
    });

    const isLoading = activeTab === 'followers' ? loadingFollowers : loadingFollowing;
    const rawData = activeTab === 'followers' ? followers : following;

    // Filter by search query
    const currentData = rawData?.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabCount = activeTab === 'followers' ? followers?.length : following?.length;

    const handleFollowChange = (targetUserId: number, isFollowing: boolean) => {
        if (activeTab === 'following' && !isFollowing) {
            queryClient.setQueryData(['following', user?.userId], (oldData: any[]) => {
                return oldData?.filter(u => u.userId !== targetUserId);
            });
        }

        queryClient.invalidateQueries({ queryKey: ['following', user?.userId] });
        queryClient.invalidateQueries({ queryKey: ['followers', user?.userId] });
    };

    return (
        <div className="min-h-screen text-white selection:bg-accent/30">
            {/* Glossy Header Background */}
            <div className="fixed top-0 left-0 right-0 h-80 bg-gradient-to-b from-accent/5 via-accent/[0.02] to-transparent pointer-events-none z-0" />

            <div className="container mx-auto px-6 pt-3 pb-24 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Navigation Breadcrumb */}
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Volver</span>
                    </motion.button>

                    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                                Mi <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Red</span>
                            </h1>
                            <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] max-w-md pt-2">
                                Aca podes ver a quien seguis y quien te sigue de forma privada.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-accent transition-colors" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filtrar por nombre o @usuario..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all backdrop-blur-md"
                            />
                        </div>
                    </header>

                    {/* Tabs */}
                    <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-1">
                        <div className="flex gap-8">
                            {[
                                { id: 'following', label: 'Siguiendo', icon: UserPlus },
                                { id: 'followers', label: 'Seguidores', icon: Users }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id as any);
                                        setSearchQuery("");
                                    }}
                                    className={`relative pb-4 flex items-center gap-2 transition-all ${activeTab === tab.id
                                        ? "text-white"
                                        : "text-zinc-600 hover:text-zinc-400"
                                        }`}
                                >
                                    <tab.icon size={18} className={activeTab === tab.id ? "text-accent" : ""} />
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        {tab.label}
                                    </span>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:block">
                            <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
                                Mostrando {currentData?.length || 0} de {tabCount || 0} conexiones
                            </span>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="relative min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center gap-6 py-20"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 border-2 border-accent/20 rounded-full border-t-accent animate-spin" />
                                        <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-accent animate-pulse" />
                                    </div>
                                    <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Sincronizando red...</span>
                                </motion.div>
                            ) : currentData && currentData.length > 0 ? (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {currentData.map((followUser, idx) => (
                                        <motion.div
                                            key={followUser.userId}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <UserCard
                                                user={followUser}
                                                onFollowChange={(isFollowing) => handleFollowChange(followUser.userId, isFollowing)}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-40 border border-dashed border-white/5 rounded-[40px] bg-white/[0.01]"
                                >
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {activeTab === 'following' ? <UserPlus size={40} className="text-zinc-700" /> : <Users size={40} className="text-zinc-700" />}
                                    </div>

                                    <h3 className="text-white font-black text-2xl uppercase tracking-tight mb-3">
                                        {searchQuery
                                            ? "Sin coincidencias"
                                            : activeTab === 'following'
                                                ? "Red solitaria"
                                                : "Sin seguidores aún"}
                                    </h3>

                                    <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center max-w-xs leading-relaxed">
                                        {searchQuery
                                            ? `No encontramos a ningún "${searchQuery}" en tu lista.`
                                            : activeTab === 'following'
                                                ? "Explora la comunidad y encontra coleccionistas de todo tipo para ver su actividad."
                                                : "Participa en la comunidad, compartí tus autos y pronto vas a ver gente interesada en tu garage."}
                                    </p>

                                    {!searchQuery && (
                                        <button
                                            onClick={() => navigate('/community')}
                                            className="mt-10 px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                                        >
                                            Ir a la Comunidad
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mb-48" />
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -ml-48 -mt-48" />
        </div>
    );
}
