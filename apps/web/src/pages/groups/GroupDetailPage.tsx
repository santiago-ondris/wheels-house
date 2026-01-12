import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Folder } from "lucide-react";
import { getGroupByName, GroupData } from "../../services/group.service";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import HotWheelCardGrid from "../../components/collection/HotWheelCardGrid";
import GroupNotFoundPage from "./GroupNotFoundPage";

export default function GroupDetailPage() {
    const { username, groupName } = useParams<{ username: string; groupName: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [group, setGroup] = useState<GroupData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const isOwner = user?.username === username;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (username && groupName) {
            fetchGroupData();
        }
    }, [username, groupName]);

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
                        <button
                            onClick={() => navigate(`/collection/group/edit/${group.groupId}`)}
                            className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
                        >
                            <Edit className="w-4 h-4" />
                            <span className="hidden md:inline">Editar</span>
                        </button>
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

            {/* Cars Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="container mx-auto px-4 py-6"
            >
                {group.cars && group.cars.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {group.cars.map((car) => (
                            <HotWheelCardGrid
                                key={car.carId}
                                car={{
                                    id: String(car.carId),
                                    name: car.name || '',
                                    brand: car.brand || '',
                                    year: 0,
                                    manufacturer: car.manufacturer || undefined,
                                    image: car.pictures && car.pictures[0]
                                        ? car.pictures[0]
                                        : "https://placehold.co/400x300/1A1B4B/D9731A?text=No+Image"
                                }}
                                onClick={() => navigate(`/car/${car.carId}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-white/40">
                        <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Este grupo no tiene autos aún</p>
                        {isOwner && group.groupId && (
                            <button
                                onClick={() => navigate(`/collection/group/edit/${group.groupId}`)}
                                className="mt-4 px-6 py-3 bg-accent/20 text-accent rounded-xl hover:bg-accent/30 transition-colors"
                            >
                                Agregar autos
                            </button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

