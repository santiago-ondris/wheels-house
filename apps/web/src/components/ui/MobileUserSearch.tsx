import { useState, useEffect } from "react";
import { Search, Loader2, User, Clock, X, Trash2, Car } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { searchUsers, BasicUser, getSearchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } from "../../services/profile.service";
import { globalSearchCars, getCarSearchHistory, addCarToSearchHistory, removeCarFromSearchHistory, clearCarSearchHistory, CarSearchResult } from "../../services/car.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { getOptimizedUrl } from "../../lib/cloudinary";

type SearchTab = 'cars' | 'users';

interface MobileUserSearchProps {
    onClose: () => void;
}

export default function MobileUserSearch({ onClose }: MobileUserSearchProps) {
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState<SearchTab>('cars');

    const [userResults, setUserResults] = useState<BasicUser[]>([]);
    const [userHistory, setUserHistory] = useState<BasicUser[]>([]);
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isUserHistoryLoading, setIsUserHistoryLoading] = useState(false);

    const [carResults, setCarResults] = useState<CarSearchResult[]>([]);
    const [carHistory, setCarHistory] = useState<CarSearchResult[]>([]);
    const [isCarLoading, setIsCarLoading] = useState(false);
    const [isCarHistoryLoading, setIsCarHistoryLoading] = useState(false);
    const [carTotal, setCarTotal] = useState(0);

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Cargar historial al montar o al cambiar de tab
    useEffect(() => {
        if (!isAuthenticated) return;
        if (activeTab === 'cars') {
            setIsCarHistoryLoading(true);
            getCarSearchHistory()
                .then(setCarHistory)
                .catch(console.error)
                .finally(() => setIsCarHistoryLoading(false));
        } else {
            setIsUserHistoryLoading(true);
            getSearchHistory()
                .then(setUserHistory)
                .catch(console.error)
                .finally(() => setIsUserHistoryLoading(false));
        }
    }, [isAuthenticated, activeTab]);

    // Buscar usuarios con debounce
    useEffect(() => {
        if (activeTab !== 'users') return;
        if (query.length < 2) { setUserResults([]); return; }

        const timer = setTimeout(async () => {
            setIsUserLoading(true);
            try {
                const data = await searchUsers(query);
                setUserResults(data);
            } catch {
                setUserResults([]);
            } finally {
                setIsUserLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, activeTab]);

    // Buscar autos con debounce
    useEffect(() => {
        if (activeTab !== 'cars') return;
        if (query.length < 2) { setCarResults([]); setCarTotal(0); return; }

        const timer = setTimeout(async () => {
            setIsCarLoading(true);
            try {
                const data = await globalSearchCars(query, 1, 8);
                setCarResults(data.items);
                setCarTotal(data.pagination.totalItems);
            } catch {
                setCarResults([]);
                setCarTotal(0);
            } finally {
                setIsCarLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, activeTab]);

    const handleSelectUser = async (username: string) => {
        if (isAuthenticated) addToSearchHistory(username).catch(console.error);
        onClose();
        navigate(`/collection/${username}`);
    };

    const handleSelectCar = async (carId: number) => {
        if (isAuthenticated) addCarToSearchHistory(carId).catch(console.error);
        onClose();
        navigate(`/car/${carId}`);
    };

    const handleRemoveUserFromHistory = async (e: React.MouseEvent, username: string) => {
        e.stopPropagation();
        try {
            await removeFromSearchHistory(username);
            setUserHistory(prev => prev.filter(u => u.username !== username));
        } catch {
            toast.error("Error al eliminar");
        }
    };

    const handleClearUserHistory = async () => {
        try {
            await clearSearchHistory();
            setUserHistory([]);
            toast.success("Historial eliminado");
        } catch {
            toast.error("Error al limpiar historial");
        }
    };

    const handleRemoveCarFromHistory = async (e: React.MouseEvent, carId: number) => {
        e.stopPropagation();
        try {
            await removeCarFromSearchHistory(carId);
            setCarHistory(prev => prev.filter(c => c.carId !== carId));
        } catch {
            toast.error("Error al eliminar");
        }
    };

    const handleClearCarHistory = async () => {
        try {
            await clearCarSearchHistory();
            setCarHistory([]);
            toast.success("Historial eliminado");
        } catch {
            toast.error("Error al limpiar historial");
        }
    };

    const handleTabChange = (tab: SearchTab) => {
        setActiveTab(tab);
        setQuery("");
        setUserResults([]);
        setCarResults([]);
    };

    const isLoading = activeTab === 'cars' ? isCarLoading : isUserLoading;
    const isHistoryLoading = activeTab === 'cars' ? isCarHistoryLoading : isUserHistoryLoading;

    return (
        <div className="fixed inset-0 z-9999 bg-[#0F0F23] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-[#0F0F23]">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={activeTab === 'cars' ? "Buscar vehículo..." : "Buscar usuario..."}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => { setQuery(""); setUserResults([]); setCarResults([]); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-3 py-2 text-accent font-medium hover:text-accent/80 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex mt-3 gap-2">
                    <button
                        onClick={() => handleTabChange('cars')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'cars'
                                ? 'bg-accent/15 text-accent border border-accent/30'
                                : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/70'
                        }`}
                    >
                        <Car className="w-4 h-4" />
                        Vehículos
                    </button>
                    <button
                        onClick={() => handleTabChange('users')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'users'
                                ? 'bg-accent/15 text-accent border border-accent/30'
                                : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/70'
                        }`}
                    >
                        <User className="w-4 h-4" />
                        Usuarios
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto bg-[#0F0F23]">
                {isHistoryLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    </div>
                )}

                {/* Car tab content */}
                {activeTab === 'cars' && !isCarHistoryLoading && (
                    <>
                        {/* Historial de autos */}
                        {query.length === 0 && isAuthenticated && carHistory.length > 0 && (
                            <div>
                                <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-white/30" />
                                        <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Recientes</span>
                                    </div>
                                    <button onClick={handleClearCarHistory} className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" /> Limpiar todo
                                    </button>
                                </div>
                                <ul>
                                    {carHistory.map((car) => (
                                        <li key={car.carId}>
                                            <div className="flex items-center border-b border-white/5">
                                                <button
                                                    onClick={() => handleSelectCar(car.carId)}
                                                    className="flex-1 text-left px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors flex items-center gap-4"
                                                >
                                                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                        {car.picture ? (
                                                            <img src={getOptimizedUrl(car.picture, 'thumbnail')} alt={car.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Car className="w-6 h-6 text-white/20" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-white font-medium text-base truncate">{car.name}</p>
                                                        <p className="text-white/50 text-sm truncate">{car.brand} · @{car.ownerUsername}</p>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={(e) => handleRemoveCarFromHistory(e, car.carId)}
                                                    className="p-3 mr-2 text-white/30 hover:text-red-400 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Resultados de autos */}
                        {query.length >= 2 && isCarLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                            </div>
                        )}
                        {query.length >= 2 && !isCarLoading && carResults.length > 0 && (
                            <>
                                <ul>
                                    {carResults.map((car) => (
                                        <li key={car.carId}>
                                            <button
                                                onClick={() => handleSelectCar(car.carId)}
                                                className="w-full text-left px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors flex items-center gap-4 border-b border-white/5"
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                    {car.picture ? (
                                                        <img src={getOptimizedUrl(car.picture, 'thumbnail')} alt={car.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Car className="w-6 h-6 text-white/20" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-white font-medium text-base truncate">{car.name}</p>
                                                    <p className="text-white/50 text-sm truncate">{car.brand} · @{car.ownerUsername}</p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                {carTotal > 8 && (
                                    <Link
                                        to={`/search?q=${encodeURIComponent(query)}&mode=cars`}
                                        onClick={onClose}
                                        className="block w-full text-center px-4 py-4 text-sm text-accent/70 hover:text-accent border-t border-white/5 transition-colors"
                                    >
                                        Ver los {carTotal} resultados →
                                    </Link>
                                )}
                            </>
                        )}
                        {query.length >= 2 && !isCarLoading && carResults.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Car className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/50 text-center">No se encontraron vehículos</p>
                                <p className="text-white/30 text-sm text-center mt-1">Intenta con otro nombre o marca</p>
                            </div>
                        )}
                        {query.length === 0 && (!isAuthenticated || carHistory.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Car className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/50 text-center">Busca vehículos de la comunidad</p>
                                <p className="text-white/30 text-sm text-center mt-1">Escribí al menos 2 caracteres</p>
                            </div>
                        )}
                    </>
                )}

                {/* User tab content */}
                {activeTab === 'users' && !isUserHistoryLoading && (
                    <>
                        {query.length === 0 && isAuthenticated && userHistory.length > 0 && (
                            <div>
                                <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-white/30" />
                                        <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Búsquedas recientes</span>
                                    </div>
                                    <button onClick={handleClearUserHistory} className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" /> Limpiar todo
                                    </button>
                                </div>
                                <ul>
                                    {userHistory.map((user) => (
                                        <li key={user.userId}>
                                            <div className="flex items-center border-b border-white/5">
                                                <button
                                                    onClick={() => handleSelectUser(user.username)}
                                                    className="flex-1 text-left px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors flex items-center gap-4"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                        {user.picture ? (
                                                            <img src={getOptimizedUrl(user.picture, 'thumbnail')} alt={user.username} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-6 h-6 text-accent" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-white font-medium text-base truncate">@{user.username}</p>
                                                        <p className="text-white/50 text-sm truncate">{user.firstName} {user.lastName}</p>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={(e) => handleRemoveUserFromHistory(e, user.username)}
                                                    className="p-3 mr-2 text-white/30 hover:text-red-400 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {query.length >= 2 && isUserLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                            </div>
                        )}
                        {query.length >= 2 && !isUserLoading && userResults.length > 0 && (
                            <ul>
                                {userResults.map((user) => (
                                    <li key={user.userId}>
                                        <button
                                            onClick={() => handleSelectUser(user.username)}
                                            className="w-full text-left px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors flex items-center gap-4 border-b border-white/5"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                {user.picture ? (
                                                    <img src={getOptimizedUrl(user.picture, 'thumbnail')} alt={user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-6 h-6 text-accent" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-white font-medium text-base truncate">@{user.username}</p>
                                                <p className="text-white/50 text-sm truncate">{user.firstName} {user.lastName}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {query.length >= 2 && !isUserLoading && userResults.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/50 text-center">No se encontraron usuarios</p>
                                <p className="text-white/30 text-sm text-center mt-1">Intenta con otro nombre</p>
                            </div>
                        )}
                        {query.length === 0 && (!isAuthenticated || userHistory.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-16 px-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/50 text-center">Busca coleccionistas</p>
                                <p className="text-white/30 text-sm text-center mt-1">Escribí al menos 2 caracteres</p>
                            </div>
                        )}
                    </>
                )}

                {isLoading && query.length >= 2 && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}
