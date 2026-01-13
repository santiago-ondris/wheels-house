import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Folder, Grid } from "lucide-react";
import { getGroupByName, GroupData } from "../../services/group.service";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import CollectionSection from "../../components/user_profile/CollectionSection";
import GroupNotFoundPage from "./GroupNotFoundPage";

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

    // Always navigate to groups list, not browser history
    const handleBack = () => navigate(`/collection/${username}/groups`);

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

    return (
        <div className="min-h-screen pb-8">
            {/* Header */}
            <PageHeader
                title={group.name}
                subtitle={`@${username} // ${group.totalCars || group.cars?.length || 0} autos${group.featured ? ' // DESTACADO' : ''}`}
                icon={Folder}
                onBack={handleBack}
                actions={
                    isOwner && group.groupId ? (
                        <div className="flex gap-2">
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
                        </div>
                    ) : undefined
                }
            />

            {/* Description */}
            {group.description && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="container mx-auto px-4 py-6"
                >
                    <p className="text-white/60 text-lg max-w-3xl">{group.description}</p>
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
                    />
                </div>
            )}
        </div>
    );
}

