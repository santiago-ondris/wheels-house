import { useState } from "react";
import { motion } from "framer-motion";
import FeedList from "../../components/social/FeedList";

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'explore' | 'following'>('explore');

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Ultra Minimalist Header - Integrated with page background */}
            <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-2xl mx-auto px-4 lg:px-0 flex items-center justify-between h-14">
                    <h1 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        Comunidad
                    </h1>

                    {/* Compact Tabs */}
                    <div className="flex h-full">
                        <button
                            onClick={() => setActiveTab('explore')}
                            className={`relative px-4 flex items-center text-[10px] font-mono tracking-[0.1em] uppercase transition-colors ${activeTab === 'explore' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                                }`}
                        >
                            Global
                            {activeTab === 'explore' && (
                                <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('following')}
                            className={`relative px-4 flex items-center text-[10px] font-mono tracking-[0.1em] uppercase transition-colors ${activeTab === 'following' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                                }`}
                        >
                            Siguiendo
                            {activeTab === 'following' && (
                                <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Feed Area - Centralized Column */}
            <main className="max-w-2xl mx-auto border-x border-white/5 min-h-screen">
                <FeedList tab={activeTab} />
            </main>
        </div>
    );
}
