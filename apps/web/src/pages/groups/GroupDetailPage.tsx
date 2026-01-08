import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Folder, Star, Car } from "lucide-react";
import { getGroupByName, GroupData } from "../../services/group.service";
import { useAuth } from "../../contexts/AuthContext";
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
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl md:text-2xl font-bold text-white">
                                    {group.name}
                                </h1>
                                {group.featured && (
                                    <Star className="w-5 h-5 text-accent fill-accent" />
                                )}
                            </div>
                            <p className="text-white/40 text-xs md:text-sm">
                                <Link to={`/collection/${username}`} className="hover:text-accent transition-colors">
                                    @{username}
                                </Link>
                                {" · "}
                                {group.totalCars || group.cars?.length || 0} autos
                            </p>
                        </div>
                        {isOwner && group.groupId && (
                            <button
                                onClick={() => navigate(`/collection/group/edit/${group.groupId}`)}
                                className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white/70 hover:text-white hover:bg-white/5 font-bold rounded-xl transition-all"
                            >
                                <Edit className="w-4 h-4" />
                                <span className="hidden md:inline">Editar</span>
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

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
                            <Link
                                key={car.carId}
                                to={`/car/${car.carId}`}
                                className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-accent/50 transition-all"
                            >
                                <div className="aspect-4/3 bg-white/5">
                                    {car.pictures && car.pictures[0] ? (
                                        <img
                                            src={car.pictures[0]}
                                            alt={car.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                            <Car className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-dark/80">
                                    <p className="text-white font-medium truncate">{car.name}</p>
                                    <p className="text-white/40 text-sm">{car.brand}</p>
                                </div>
                            </Link>
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

