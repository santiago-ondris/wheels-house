import { useState } from "react";
import { motion } from "framer-motion";
import FeedList from "../../components/social/FeedList";
import LeftSidebar from "../../components/social/LeftSidebar";
import RightSidebar from "../../components/social/RightSidebar";

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'explore' | 'following'>('explore');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<{ userId: number, username: string } | null>(null);

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

            {/* Main Layout Container */}
            <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
                <div className="flex justify-center gap-8">
                    {/* Sidebar Izquierdo - Visible desde XL (1280px) */}
                    <div className="hidden xl:block w-[280px] shrink-0">
                        <LeftSidebar />
                    </div>

                    {/* Feed Area - Centralized Column */}
                    <main className="w-full max-w-2xl border-x border-white/5 min-h-screen">
                        <FeedList 
                            tab={activeTab} 
                            filters={{ 
                                type: selectedType !== 'all' ? selectedType : undefined,
                                targetUserId: selectedUser?.userId 
                            }} 
                        />
                    </main>

                    {/* Sidebar Derecho - Visible desde LG (1024px) */}
                    <div className="hidden lg:block w-[280px] shrink-0">
                        <RightSidebar 
                            activeType={selectedType}
                            setSelectedType={setSelectedType}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
