import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, User, Trash2, Car, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { searchUsers, BasicUser, getSearchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } from "../../services/profile.service";
import { globalSearchCars, getCarSearchHistory, addCarToSearchHistory, removeCarFromSearchHistory, clearCarSearchHistory, CarSearchResult } from "../../services/car.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { getOptimizedUrl } from "../../lib/cloudinary";

type SearchTab = 'cars' | 'users';

interface UserSearchProps {
    className?: string;
}

export default function UserSearch({ className = "" }: UserSearchProps) {
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState<SearchTab>('cars');

    const [userResults, setUserResults] = useState<BasicUser[]>([]);
    const [userHistory, setUserHistory] = useState<BasicUser[]>([]);
    const [isUserLoading, setIsUserLoading] = useState(false);

    const [carResults, setCarResults] = useState<CarSearchResult[]>([]);
    const [carHistory, setCarHistory] = useState<CarSearchResult[]>([]);
    const [isCarLoading, setIsCarLoading] = useState(false);
    const [carTotal, setCarTotal] = useState(0);

    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleClose = () => {
        setIsOpen(false);
        setActiveTab('cars');
    };

    // Cargar historial cuando se abre el dropdown (tab activo)
    useEffect(() => {
        if (!isAuthenticated || !isOpen || query.length > 0) return;
        if (activeTab === 'users') {
            getSearchHistory().then(setUserHistory).catch(console.error);
        } else {
            getCarSearchHistory().then(setCarHistory).catch(console.error);
        }
    }, [isAuthenticated, isOpen, query, activeTab]);

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
                const data = await globalSearchCars(query, 1, 6);
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

    // Cerrar al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                handleClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectUser = async (username: string) => {
        if (isAuthenticated) addToSearchHistory(username).catch(console.error);
        handleClose();
        setQuery("");
        navigate(`/collection/${username}`);
    };

    const handleSelectCar = async (carId: number) => {
        if (isAuthenticated) addCarToSearchHistory(carId).catch(console.error);
        handleClose();
        setQuery("");
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

    const handleClearUserHistory = async (e: React.MouseEvent) => {
        e.stopPropagation();
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

    const handleClearCarHistory = async (e: React.MouseEvent) => {
        e.stopPropagation();
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
        setUserResults([]);
        setCarResults([]);
    };

    const isLoading = activeTab === 'cars' ? isCarLoading : isUserLoading;
    const showDropdown = isOpen;

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-white/50" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={activeTab === 'cars' ? "Buscar vehículo..." : "Buscar usuario..."}
                    className="w-full bg-white/10 border border-white/10 rounded-lg py-2 pl-9 pr-8 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    onFocus={() => setIsOpen(true)}
                />
                {isLoading ? (
                    <Loader2 className="absolute right-3 w-4 h-4 text-white/50 animate-spin" />
                ) : query ? (
                    <button
                        onClick={() => { setQuery(""); setUserResults([]); setCarResults([]); }}
                        className="absolute right-3 hover:text-white text-white/50 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                ) : null}
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => handleTabChange('cars')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                                activeTab === 'cars'
                                    ? 'text-accent border-b-2 border-accent -mb-px bg-accent/5'
                                    : 'text-white/40 hover:text-white/70'
                            }`}
                        >
                            <Car className="w-3.5 h-3.5" />
                            <span>Vehículos</span>
                        </button>
                        <button
                            onClick={() => handleTabChange('users')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
                                activeTab === 'users'
                                    ? 'text-accent border-b-2 border-accent -mb-px bg-accent/5'
                                    : 'text-white/40 hover:text-white/70'
                            }`}
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>Usuarios</span>
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === 'cars' ? (
                        <CarSearchContent
                            query={query}
                            results={carResults}
                            history={carHistory}
                            totalResults={carTotal}
                            isAuthenticated={isAuthenticated}
                            onSelectCar={handleSelectCar}
                            onRemoveFromHistory={handleRemoveCarFromHistory}
                            onClearHistory={handleClearCarHistory}
                            onCloseDropdown={handleClose}
                        />
                    ) : (
                        <UserSearchContent
                            query={query}
                            results={userResults}
                            history={userHistory}
                            isAuthenticated={isAuthenticated}
                            onSelectUser={handleSelectUser}
                            onRemoveFromHistory={handleRemoveUserFromHistory}
                            onClearHistory={handleClearUserHistory}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

// --- Sub-componentes ---

interface CarSearchContentProps {
    query: string;
    results: CarSearchResult[];
    history: CarSearchResult[];
    totalResults: number;
    isAuthenticated: boolean;
    onSelectCar: (carId: number) => void;
    onRemoveFromHistory: (e: React.MouseEvent, carId: number) => void;
    onClearHistory: (e: React.MouseEvent) => void;
    onCloseDropdown: () => void;
}

function CarSearchContent({ query, results, history, totalResults, isAuthenticated, onSelectCar, onRemoveFromHistory, onClearHistory, onCloseDropdown }: CarSearchContentProps) {
    if (query.length === 0 && isAuthenticated && history.length > 0) {
        return (
            <>
                <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Recientes
                    </span>
                    <button onClick={onClearHistory} className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Limpiar
                    </button>
                </div>
                <ul className="py-2 max-h-[60vh] overflow-y-auto">
                    {history.map((car) => (
                        <li key={car.carId}>
                            <CarResultItem car={car} onSelect={onSelectCar} onRemove={onRemoveFromHistory} showRemove />
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    if (query.length >= 2 && results.length > 0) {
        return (
            <>
                <ul className="py-2 max-h-[60vh] overflow-y-auto">
                    {results.map((car) => (
                        <li key={car.carId}>
                            <CarResultItem car={car} onSelect={onSelectCar} />
                        </li>
                    ))}
                </ul>
                {totalResults > 6 && (
                    <div className="border-t border-white/5">
                        <Link
                            to={`/search?q=${encodeURIComponent(query)}&mode=cars`}
                            onClick={onCloseDropdown}
                            className="block w-full text-center px-4 py-2.5 text-xs text-accent/70 hover:text-accent hover:bg-white/5 transition-colors"
                        >
                            Ver los {totalResults} resultados →
                        </Link>
                    </div>
                )}
            </>
        );
    }

    if (query.length >= 2 && results.length === 0) {
        return (
            <div className="px-4 py-12 text-center text-white/50 flex flex-col items-center gap-3">
                <Car className="w-8 h-8 opacity-20" />
                <p className="text-base">No se encontraron vehículos.</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-8 text-center text-white/30 flex flex-col items-center gap-2">
            <Search className="w-6 h-6 opacity-30" />
            <p className="text-xs">Escribí al menos 2 caracteres</p>
        </div>
    );
}

interface CarResultItemProps {
    car: CarSearchResult;
    onSelect: (carId: number) => void;
    onRemove?: (e: React.MouseEvent, carId: number) => void;
    showRemove?: boolean;
}

function CarResultItem({ car, onSelect, onRemove, showRemove }: CarResultItemProps) {
    return (
        <div className="flex items-center group border-b border-white/5 last:border-0">
            <button
                onClick={() => onSelect(car.carId)}
                className="flex-1 text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3"
            >
                <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                    {car.picture ? (
                        <img src={getOptimizedUrl(car.picture, 'thumbnail')} alt={car.name} className="w-full h-full object-cover" />
                    ) : (
                        <Car className="w-4 h-4 text-white/30" />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-white font-medium text-sm group-hover:text-accent transition-colors truncate">{car.name}</p>
                    <p className="text-white/40 text-xs truncate">{car.brand} · @{car.ownerUsername}</p>
                </div>
            </button>
            {showRemove && onRemove && (
                <button
                    onClick={(e) => onRemove(e, car.carId)}
                    className="p-2 mr-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

interface UserSearchContentProps {
    query: string;
    results: BasicUser[];
    history: BasicUser[];
    isAuthenticated: boolean;
    onSelectUser: (username: string) => void;
    onRemoveFromHistory: (e: React.MouseEvent, username: string) => void;
    onClearHistory: (e: React.MouseEvent) => void;
}

function UserSearchContent({ query, results, history, isAuthenticated, onSelectUser, onRemoveFromHistory, onClearHistory }: UserSearchContentProps) {
    if (query.length === 0 && isAuthenticated && history.length > 0) {
        return (
            <>
                <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-white/5">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Recientes
                    </span>
                    <button onClick={onClearHistory} className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Limpiar
                    </button>
                </div>
                <ul className="py-2 max-h-[60vh] overflow-y-auto">
                    {history.map((user) => (
                        <li key={user.userId}>
                            <div className="flex items-center group border-b border-white/5 last:border-0">
                                <button
                                    onClick={() => onSelectUser(user.username)}
                                    className="flex-1 text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-4"
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                        {user.picture ? (
                                            <img src={getOptimizedUrl(user.picture, 'thumbnail')} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4 text-accent" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm group-hover:text-accent transition-colors">@{user.username}</p>
                                        <p className="text-white/50 text-xs">{user.firstName} {user.lastName}</p>
                                    </div>
                                </button>
                                <button
                                    onClick={(e) => onRemoveFromHistory(e, user.username)}
                                    className="p-2 mr-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    if (query.length >= 2 && results.length > 0) {
        return (
            <ul className="py-2 max-h-[60vh] overflow-y-auto">
                {results.map((user) => (
                    <li key={user.userId}>
                        <button
                            onClick={() => onSelectUser(user.username)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-4 group border-b border-white/5 last:border-0"
                        >
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                {user.picture ? (
                                    <img src={getOptimizedUrl(user.picture, 'thumbnail')} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-4 h-4 text-accent" />
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm group-hover:text-accent transition-colors">@{user.username}</p>
                                <p className="text-white/50 text-xs">{user.firstName} {user.lastName}</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        );
    }

    if (query.length >= 2 && results.length === 0) {
        return (
            <div className="px-4 py-12 text-center text-white/50 flex flex-col items-center gap-3">
                <Search className="w-8 h-8 opacity-20" />
                <p className="text-base">No se encontraron usuarios.</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-8 text-center text-white/30 flex flex-col items-center gap-2">
            <Search className="w-6 h-6 opacity-30" />
            <p className="text-xs">Escribí al menos 2 caracteres</p>
        </div>
    );
}
