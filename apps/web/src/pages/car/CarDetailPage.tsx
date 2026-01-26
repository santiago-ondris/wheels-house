import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Edit, Trash2, ArrowLeft, Star, Loader2 } from "lucide-react";
import { getCar, deleteCar, CarData } from "../../services/car.service";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigateBack } from "../../hooks/useNavigateBack";

import { CarMasonryGrid } from "../../components/cars/CarMasonryGrid";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";
import RelatedCarsCarousel from "../../components/cars/RelatedCarsCarousel";
import { LikeButton } from "../../features/social/components/likes/LikeButton";

export const CarDetailPage = () => {
    const { carId } = useParams<{ carId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [car, setCar] = useState<CarData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = user?.username === car?.ownerUsername;

    // Refetch when carId changes OR when we navigate back (location.key changes)
    useEffect(() => {
        window.scrollTo(0, 0);
        if (carId) {
            fetchCarData(carId);
        }
    }, [carId, location.key]);

    const fetchCarData = async (id: string) => {
        setIsLoading(true);
        try {
            const data = await getCar(id);
            setCar(data);
        } catch (error) {
            console.error("Error fetching car:", error);
            toast.error("Error al cargar el auto");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!car?.carId || isDeleting) return;
        setIsDeleting(true);
        try {
            await deleteCar(car.carId);
            toast.success(car.wished ? "Auto eliminado de la wishlist" : "Auto eliminado correctamente");
            navigate(car.wished ? `/wishlist/${car.ownerUsername}` : `/collection/${car.ownerUsername}`);
        } catch (error) {
            console.error("Error deleting car:", error);
            toast.error("Error al eliminar el auto");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = () => {
        if (!car?.carId) return;
        if (car.wished) {
            navigate(`/wishlist/edit/${car.carId}`);
        } else {
            navigate(`/collection/edit/${car.carId}`);
        }
    };

    // Safe back navigation with fallback to owner's collection
    const handleBack = useNavigateBack(
        car?.wished
            ? `/wishlist/${car?.ownerUsername || user?.username}`
            : `/collection/${car?.ownerUsername || user?.username || ''}`
    );

    const galleryRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (isLoading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-white">Cargando...</div>;
    }

    if (!car) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-white">Auto no encontrado</div>;
    }

    const galleryImages = car.pictures && car.pictures.length > 0 ? car.pictures : [];

    return (
        <div className="w-full min-h-screen bg-background text-white flex flex-col font-arvo">
            <section ref={galleryRef} className="w-full pt-6 md:pt-10 pb-10 px-4 md:px-10">
                <div className="max-w-7xl mx-auto mb-6 flex justify-between items-end">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 text-sm text-gray-400 mb-4"
                        >
                            <button
                                onClick={handleBack}
                                className="p-2 text-white/60 hover:text-white transition-colors rounded-xl hover:bg-white/5 active:scale-95 mr-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <span className="uppercase tracking-widest">{car.brand}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full" />
                            <span className="text-white font-bold">{car.name}</span>
                            {car.wished && (
                                <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    Wishlist
                                </span>
                            )}
                        </motion.div>
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => scrollTo(detailsRef)}
                            className="text-xs text-emerald-400/80 hover:text-emerald-400 flex items-center gap-2 transition-colors uppercase tracking-widest font-bold cursor-pointer"
                        >
                            Ir a detalles <ArrowDown size={14} />
                        </motion.button>
                    </div>

                    {isOwner ? (
                        <div className="flex gap-3 items-center">
                            <LikeButton
                                id={car.carId!}
                                initialIsLiked={car.isLiked || false}
                                initialLikesCount={car.likesCount || 0}
                                type="car"
                            />
                            <div className="w-px h-6 bg-white/10 mx-1" />
                            <button
                                onClick={handleEdit}
                                className={`p-2 border rounded-lg transition-colors ${car.wished
                                    ? 'border-amber-500/30 hover:bg-amber-500/10 text-amber-400 hover:text-amber-300'
                                    : 'border-white/10 hover:bg-white/10 text-white/70 hover:text-white'
                                    }`}
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="p-2 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3 items-center">
                            <LikeButton
                                id={car.carId!}
                                initialIsLiked={car.isLiked || false}
                                initialLikesCount={car.likesCount || 0}
                                type="car"
                            />
                        </div>
                    )}

                </div>

                {galleryImages.length > 0 && (
                    <div className="mt-6">
                        <CarMasonryGrid images={galleryImages} />
                    </div>
                )}
            </section>

            <main ref={detailsRef} className="flex-1 bg-[#050505] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex flex-col lg:flex-row gap-16">

                    <div className="flex-1">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => scrollTo(galleryRef)}
                                className="text-xs text-gray-600 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-widest"
                            >
                                Ir a galería <ArrowUp size={14} />
                            </button>
                        </div>
                        <h1 className="text-5xl md:text-7xl text-white mb-6 font-bold leading-tight">
                            {car.name}
                        </h1>

                        <div className="flex flex-wrap gap-3 mb-10">
                            <span className="px-4 py-2 bg-white text-black text-sm font-bold uppercase rounded-full tracking-wide">
                                {car.brand || "N/A"}
                            </span>
                            <span className="px-4 py-2 border border-white/20 text-white text-sm font-bold uppercase rounded-full tracking-wide">
                                {car.series || "N/A"}
                            </span>
                        </div>

                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                            {car.description || "Sin descripción."}
                        </p>
                    </div>

                    <div className="lg:w-1/3 bg-white/5 rounded-2xl p-8 border border-white/10 h-fit">
                        <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-white/10">Especificaciones</h3>

                        <ul className="space-y-6">
                            {car.brand && <InfoRow label="Marca" value={car.brand} />}
                            {car.name && <InfoRow label="Modelo" value={car.name} />}
                            {car.color && <InfoRow label="Color" value={car.color} />}
                            {car.series && <InfoRow label="Series" value={car.series} />}
                            {car.manufacturer && <InfoRow label="Fabricante" value={car.manufacturer} />}
                            {car.designer && <InfoRow label="Diseñador" value={car.designer} />}
                            {car.scale && <InfoRow label="Escala" value={car.scale} />}
                            {car.condition && <InfoRow label="Condición" value={car.condition} />}
                            {car.country && <InfoRow label="País" value={car.country} />}
                            {car.rarity && <InfoRow label="Rareza" value={car.rarity} />}
                            {car.quality && <InfoRow label="Calidad" value={car.quality} />}
                            {car.variety && <InfoRow label="Variedad" value={car.variety} />}
                            {car.finish && <InfoRow label="Acabado" value={car.finish} />}
                        </ul>
                    </div>
                </div>
            </main>

            {car.ownerUsername && (
                <RelatedCarsCarousel
                    ownerUsername={car.ownerUsername}
                    currentCarId={car.carId}
                />
            )}


            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Eliminar Auto"
            >
                <div className="p-6">
                    <p className="text-white/80 mb-8 max-w-sm">
                        ¿Estás seguro que querés eliminar el <span className="font-bold text-white">{car.name}</span>?
                        <br /><br />
                        <span className="text-danger font-medium italic">
                            {car.wished
                                ? "Este auto se eliminará de tu wishlist."
                                : "Esta acción eliminará el auto de toda tu colección y no se puede deshacer."
                            }
                        </span>
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-red-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                'Eliminar'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <li className="flex justify-between items-center">
        <span className="text-gray-500 text-sm uppercase tracking-wider">{label}</span>
        <span className="text-white font-medium text-right">{value}</span>
    </li>
);

export default CarDetailPage;