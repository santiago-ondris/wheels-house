import { useState } from "react";
import { motion } from "framer-motion";
import FeedList from "../../components/social/FeedList";
import FeaturedCollections from "../../components/home/FeaturedCollections";
import { Users, LayoutGrid, UserCheck } from "lucide-react";

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'explore' | 'following'>('explore');

    const fadeInUp = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <div className="border-b border-zinc-900 bg-zinc-900/10">
                <div className="container mx-auto px-6 py-12">
                    <motion.div {...fadeInUp}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg">
                                <Users className="text-accent w-6 h-6" />
                            </div>
                            <span className="text-accent font-mono text-xs tracking-[0.4em] uppercase">Comunidad_Wheels</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                            Mural de la<br />Comunidad
                        </h1>
                        <p className="text-zinc-500 font-mono text-sm max-w-xl uppercase tracking-wider leading-relaxed">
                            Explora las últimas adiciones, hitos y actividad de coleccionistas de todo el mundo.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Feed Area */}
                    <div className="flex-1 min-w-0">
                        {/* Custom Tabs */}
                        <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
                            <div className="flex gap-8">
                                <button
                                    onClick={() => setActiveTab('explore')}
                                    className={`relative flex items-center gap-2 pb-4 text-xs font-mono tracking-[0.2em] uppercase transition-colors ${activeTab === 'explore' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                                        }`}
                                >
                                    <LayoutGrid size={14} />
                                    EXPLORAR
                                    {activeTab === 'explore' && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('following')}
                                    className={`relative flex items-center gap-2 pb-4 text-xs font-mono tracking-[0.2em] uppercase transition-colors ${activeTab === 'following' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                                        }`}
                                >
                                    <UserCheck size={14} />
                                    SIGUIENDO
                                    {activeTab === 'following' && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                        />
                                    )}
                                </button>
                            </div>

                            <div className="hidden md:block text-[10px] font-mono text-zinc-700 tracking-widest uppercase">
                                [ ACTUALIZADO_EN_VIVO ]
                            </div>
                        </div>

                        <div className="min-h-[600px]">
                            <FeedList tab={activeTab} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="hidden lg:block w-80 shrink-0">
                        <div className="sticky top-24 space-y-10">
                            <div>
                                <h3 className="text-white font-black text-sm uppercase tracking-tighter mb-6 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-accent" />
                                    COLECCIONES_DESTACADAS
                                </h3>
                                <FeaturedCollections />
                            </div>

                            <div className="p-6 border border-zinc-900 bg-zinc-900/20">
                                <h4 className="text-white text-xs font-mono mb-3 uppercase tracking-widest">¿Quieres aparecer aquí?</h4>
                                <p className="text-zinc-500 text-[10px] font-mono leading-relaxed uppercase tracking-tighter">
                                    MANTÉN TU COLECCIÓN ACTUALIZADA Y COMPARTE TUS ÚLTIMOS HALLAZGOS CON EL HASHTAG #WHEELSHOUSE EN TUS REDES.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
