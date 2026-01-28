import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Folder, Grid, ArrowLeft, Star } from "lucide-react";
import { getGroupByName, GroupData } from "../../services/group.service";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigateBack } from "../../hooks/useNavigateBack";
import PageHeader from "../../components/ui/PageHeader";
import CollectionSection from "../../components/user_profile/CollectionSection";
import GroupNotFoundPage from "./GroupNotFoundPage";
import { LikeButton } from "../../features/social/components/likes/LikeButton";


export default function GroupDetailPage() {
    const { username, groupName } = useParams<{ username: string; groupName: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [group, setGroup] = useState<GroupData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const isOwner = user?.username === username;

    // Refetch when navigating back to this page (location.key changes)
    useEffect(() => {
        if (username && groupName) {
            fetchGroupData();
        }
    }, [username, groupName, location.key]);

    const fetchGroupData = async () => {
        try {
            const decodedName = decodeURIComponent(groupName!);
            const data = await getGroupByName(username!, decodedName);
            setGroup(data);
        } catch (error) {
            console.error("Error fetching group:", error);
            setNotFound(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = useNavigateBack(`/collection/${username}/groups`);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Cargando...
            </div>
        );
    }

    if (notFound || !group) {
        return <GroupNotFoundPage />;
    }

    const hasPicture = !!group.picture;

    return (
        <div className="min-h-screen pb-8">
            {hasPicture ? (
                // PREMIUM HERO HEADER
                <div className="relative w-full aspect-[3/1] min-h-[250px] overflow-hidden group">
                    {/* Background Image with Parallax-like feel */}
                    <div className="absolute inset-0">
                        <img
                            src={group.picture!}
                            alt={group.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
                        <div className="absolute inset-0 bg-black/20" /> {/* General dim */}
                    </div>

                    {/* Navbar / Back Button Area */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
                        <button
                            onClick={handleBack}
                            className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/10 rounded-full transition-all group"
                        >
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>

                        {/* Actions Top Right */}
                        <div className="flex gap-2.5 items-center">
                            <LikeButton
                                id={group.groupId!}
                                initialIsLiked={group.isLiked || false}
                                initialLikesCount={group.likesCount || 0}
                                type="group"
                                className="bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 rounded-full pr-3 !transition-all active:scale-90"
                            />
                            {isOwner && group.groupId && (
                                <>
                                    <div className="w-[1px] h-5 bg-white/10 mx-1" />
                                    <button
                                        onClick={() => navigate(`/collection/group/manage/${group.groupId}`)}
                                        className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl text-white border border-white/20 rounded-full transition-all active:scale-90"
                                        title="Gestionar Autos"
                                    >
                                        <Grid className="w-5 h-5 text-white/80" />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/collection/group/edit/${group.groupId}`)}
                                        className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl text-white border border-white/20 rounded-full transition-all active:scale-90"
                                        title="Editar Grupo"
                                    >
                                        <Edit className="w-5 h-5 text-white/80" />
                                    </button>
                                </>
                            )}
                        </div>

                    </div>


                    {/* Content Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
                        <div className="container mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col gap-2"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="px-3 py-1 bg-accent/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        Grupo
                                    </div>
                                    {group.featured && (
                                        <div className="px-3 py-1 bg-yellow-500/90 backdrop-blur-md text-black text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-black" /> Destacado
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-2 drop-shadow-2xl">
                                    {group.name}
                                </h1>
                                <div className="flex items-center gap-6 text-white/80 font-mono text-sm md:text-base">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                            <span className="font-bold">{username?.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <span className="opacity-70">@{username}</span>
                                    </div>
                                    <div className="w-px h-4 bg-white/30" />
                                    <span className="font-bold">{group.totalCars || group.cars?.length || 0} Autos</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Standard Header Fallback */
                <PageHeader
                    title={group.name}
                    subtitle={`@${username} // ${group.totalCars || group.cars?.length || 0} autos${group.featured ? ' // DESTACADO' : ''}`}
                    icon={Folder}
                    onBack={handleBack}
                    actions={
                        <div className="flex gap-3 items-center">
                            <LikeButton
                                id={group.groupId!}
                                initialIsLiked={group.isLiked || false}
                                initialLikesCount={group.likesCount || 0}
                                type="group"
                            />
                            {isOwner && group.groupId && (
                                <>
                                    <div className="w-px h-6 bg-white/10 mx-1" />
                                    <button
                                        onClick={() => navigate(`/collection/group/manage/${group.groupId}`)}
                                        className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
                                    >
                                        <Grid className="w-4 h-4" />
                                        <span className="hidden md:inline">Gestionar Autos</span>
                                    </button>
                                    <button
                                        onClick={() => navigate(`/collection/group/edit/${group.groupId}`)}
                                        className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span className="hidden md:inline">Editar Info</span>
                                    </button>
                                </>
                            )}
                        </div>
                    }

                />
            )}


            {/* Description */}
            {group.description && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="container mx-auto px-4 py-8"
                >
                    <p className={`text-white/70 text-lg md:text-xl max-w-3xl leading-relaxed ${hasPicture ? 'font-medium' : ''}`}>
                        {group.description}
                    </p>
                </motion.div>
            )}

            {/* Collection Section */}
            {group.groupId && (
                <div className="container mx-auto px-4">
                    <CollectionSection
                        username={username!}
                        isOwner={isOwner}
                        groupId={group.groupId}
                        mode="view"
                        enableMultiSelect={false}
                        defaultSortPreference={user?.defaultSortPreference}
                    />
                </div>
            )}
        </div>
    );
}

