import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Plus, Check, Car, ImageOff, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import { getWishlist, deleteCar, WishlistCarData } from "../../services/car.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigateBack } from "../../hooks/useNavigateBack";
import { getConditionLabel } from "../../data/carOptions";

export default function WishlistPage() {
    const { username } = useParams<{ username: string }>();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [wishlist, setWishlist] = useState<WishlistCarData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isOwner = isAuthenticated && user?.username === username;

    // Safe back navigation with fallback
    const handleBack = useNavigateBack(`/collection/${username}`);

    // Refetch when username changes OR when we navigate back to this page
    // location.key changes on each navigation, triggering refetch
    useEffect(() => {
        fetchWishlist();
    }, [username, location.key]);

    const fetchWishlist = async () => {
        if (!username) return;

        try {
            setIsLoading(true);
            const data = await getWishlist(username);
            setWishlist(data);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            toast.error("Error al cargar la wishlist");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGotIt = (carId: number) => {
        navigate(`/wishlist/got-it/${carId}`);
    };

    const handleEdit = (carId: number) => {
        navigate(`/wishlist/edit/${carId}`);
    };

    const handleDelete = (carId: number, carName: string) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">
                    ¿Eliminar <span className="font-bold">"{carName}"</span> de tu wishlist?
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                        }}
                        className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await deleteCar(carId);
                                setWishlist(prev => prev.filter(c => c.carId !== carId));
                                toast.success("Auto eliminado de la wishlist");
                            } catch (error) {
                                console.error("Error deleting car:", error);
                                toast.error("Error al eliminar el auto");
                            }
                        }}
                        className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-400 text-white text-sm font-bold rounded-lg transition-all"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px',
            },
        });
    };

    return (
        <div className="min-h-screen pb-32 md:pb-8">
            <PageHeader
                title="En busca de"
                subtitle={isOwner ? "Vehículos que estás buscando" : `Búsqueda de @${username}`}
                icon={Target}
                onBack={handleBack}
                actions={
                    isOwner && (
                        <Link
                            to="/wishlist/add"
                            className="hidden md:flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar
                        </Link>
                    )
                }
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="container mx-auto px-4 py-6"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <Target className="w-16 h-16 text-white/10 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white/60 mb-2">
                            {isOwner ? "No tenes búsquedas activas" : "Sin búsquedas"}
                        </h3>
                        <p className="text-white/40 text-sm mb-6">
                            {isOwner
                                ? "Inicia tu búsqueda agregando los autos que quieras encontrar"
                                : `@${username} aún no tiene vehículos en su lista de búsqueda`
                            }
                        </p>
                        {isOwner && (
                            <Link
                                to="/wishlist/add"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-lg transition-all -skew-x-12"
                            >
                                <div className="skew-x-12 flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    INICIAR BÚSQUEDA
                                </div>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlist.map((car, index) => (
                            <motion.div
                                key={car.carId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group"
                            >
                                {/* Image */}
                                <Link to={`/car/${car.carId}`} className="block aspect-[16/10] bg-white/[0.02] relative overflow-hidden">
                                    {car.pictures && car.pictures.length > 0 ? (
                                        <img
                                            src={car.pictures[0]}
                                            alt={car.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageOff className="w-12 h-12 text-white/10" />
                                        </div>
                                    )}

                                    {/* Hunt Badge */}
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500/90 rounded-sm flex items-center gap-1.5 border border-black/10">
                                        <Target className="w-3 h-3 text-black" />
                                        <span className="text-[10px] font-black text-black uppercase tracking-tighter">
                                            EN BUSCA
                                        </span>
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-bold truncate">
                                                {car.name}
                                            </h3>
                                            <p className="text-white/40 text-sm truncate">
                                                {car.brand} • {car.manufacturer}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/car/${car.carId}`}
                                            className="text-white/20 hover:text-white transition-colors"
                                        >
                                            <Car className="w-5 h-5" />
                                        </Link>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-wider">
                                        <div className="bg-white/[0.03] rounded-lg px-2 py-1.5 text-center">
                                            <span className="text-white/30 block">Color</span>
                                            <span className="text-white/70 truncate block">{car.color}</span>
                                        </div>
                                        <div className="bg-white/[0.03] rounded-lg px-2 py-1.5 text-center">
                                            <span className="text-white/30 block">Escala</span>
                                            <span className="text-white/70">{car.scale}</span>
                                        </div>
                                        <div className="bg-white/[0.03] rounded-lg px-2 py-1.5 text-center">
                                            <span className="text-white/30 block">Estado</span>
                                            <span className="text-white/70 truncate block">{getConditionLabel(car.condition || "Abierto", true)}</span>
                                        </div>
                                    </div>

                                    {/* Actions - Only for owner */}
                                    {isOwner && (
                                        <div className="mt-4 space-y-2">
                                            <button
                                                onClick={() => handleGotIt(car.carId!)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-emerald-500 font-bold text-sm rounded-xl transition-all active:scale-[0.98]"
                                            >
                                                <Check className="w-4 h-4" />
                                                ¡Lo conseguí!
                                            </button>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(car.carId!)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-sm rounded-lg transition-all"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(car.carId!, car.name)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 text-sm rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Mobile FAB - Only for owner */}
            {isOwner && (
                <Link
                    to="/wishlist/add"
                    className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-amber-500 hover:bg-amber-400 text-black rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 transition-all z-50"
                >
                    <Plus className="w-6 h-6" />
                </Link>
            )}
        </div>
    );
}
