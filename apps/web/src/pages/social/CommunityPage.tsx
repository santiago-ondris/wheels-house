import { useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import FeedList from "../../components/social/FeedList";
import LeftSidebar from "../../components/social/LeftSidebar";
import RightSidebar from "../../components/social/RightSidebar";
import MobileFeedFilters from "../../components/social/MobileFeedFilters";
import { useFeedRefresh } from "../../hooks/useSocialFeed";

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'explore' | 'following'>('explore');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<{ userId: number, username: string } | null>(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [exploreHasUnread, setExploreHasUnread] = useState(false);
    const [followingHasUnread, setFollowingHasUnread] = useState(false);

    const refresh = useFeedRefresh();

    const handleTabClick = async (tab: 'explore' | 'following') => {
        if (activeTab === tab) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            await refresh(tab);
            if (tab === 'explore') setExploreHasUnread(false);
            else setFollowingHasUnread(false);
        } else {
            setActiveTab(tab);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Ultra Minimalist Header - Integrated with page background */}
            <div className="sticky top-[72px] z-30 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-2xl mx-auto px-4 lg:px-0 flex items-center justify-between h-14">
                    <div className="flex items-center gap-2">
                        <h1 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                            Comunidad
                        </h1>
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setIsFiltersOpen(true)}
                            className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"
                            aria-label="Abrir filtros"
                        >
                            <Filter className={`w-4 h-4 ${selectedType !== 'all' || selectedUser ? 'text-accent' : ''}`} />
                        </button>
                    </div>

                    {/* Compact Tabs */}
                    <div className="flex h-full">
                        <button
                            onClick={() => handleTabClick('explore')}
                            className={`relative px-4 flex items-center text-[10px] font-mono tracking-[0.1em] uppercase transition-colors ${activeTab === 'explore' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                                }`}
                        >
                            <span className="relative">
                                Global
                                {exploreHasUnread && (
                                    <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                )}
                            </span>
                            {activeTab === 'explore' && (
                                <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                        </button>
                        <button
                            onClick={() => handleTabClick('following')}
                            className={`relative px-4 flex items-center text-[10px] font-mono tracking-[0.1em] uppercase transition-colors ${activeTab === 'following' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
                                }`}
                        >
                            <span className="relative">
                                Siguiendo
                                {followingHasUnread && (
                                    <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                                )}
                            </span>
                            {activeTab === 'following' && (
                                <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <MobileFeedFilters
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
                activeType={selectedType}
                setSelectedType={setSelectedType}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />

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
                            onUnreadChange={(hasUnread) => {
                                if (activeTab === 'explore') setExploreHasUnread(hasUnread);
                                else setFollowingHasUnread(hasUnread);
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
