import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, Car, User, Loader2, ArrowUpDown, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { globalSearchCars, CarSearchResult, GlobalCarSearchResponse } from "../../services/car.service";
import { searchUsers, BasicUser } from "../../services/profile.service";
import { getOptimizedUrl } from "../../lib/cloudinary";
import Pagination from "../../components/collection/Pagination";

type SearchMode = 'cars' | 'users';
type CarSortBy = 'likes' | 'newest';

export default function SearchResultsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const q = searchParams.get('q') || '';
    const mode = (searchParams.get('mode') as SearchMode) || 'cars';

    const [carData, setCarData] = useState<GlobalCarSearchResponse | null>(null);
    const [isCarLoading, setIsCarLoading] = useState(false);
    const [carPage, setCarPage] = useState(1);
    const [carsPerPage, setCarsPerPage] = useState(15);
    const [carSort, setCarSort] = useState<CarSortBy>('likes');

    const [userResults, setUserResults] = useState<BasicUser[]>([]);
    const [isUserLoading, setIsUserLoading] = useState(false);

    useEffect(() => {
        setCarPage(1);
    }, [q, carSort, carsPerPage]);

    useEffect(() => {
        if (mode !== 'cars' || q.length < 2) { setCarData(null); return; }

        setIsCarLoading(true);
        globalSearchCars(q, carPage, carsPerPage, carSort)
            .then(setCarData)
            .catch(() => setCarData(null))
            .finally(() => setIsCarLoading(false));
    }, [q, mode, carPage, carsPerPage, carSort]);

    useEffect(() => {
        if (mode !== 'users' || q.length < 2) { setUserResults([]); return; }

        setIsUserLoading(true);
        searchUsers(q)
            .then(setUserResults)
            .catch(() => setUserResults([]))
            .finally(() => setIsUserLoading(false));
    }, [q, mode]);

    const setMode = (newMode: SearchMode) => {
        setSearchParams({ q, mode: newMode });
    };

    const handlePageChange = (page: number) => {
        setCarPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    return (
        <div className="min-h-screen bg-[#0F0F23] pt-2 pb-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Search className="w-5 h-5 text-white/40" />
                        <h1 className="text-white font-semibold text-xl">
                            Resultados para <span className="text-accent">"{q}"</span>
                        </h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode('cars')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                mode === 'cars'
                                    ? 'bg-accent text-white'
                                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10'
                            }`}
                        >
                            <Car className="w-4 h-4" />
                            Vehículos
                            {carData && <span className="text-xs opacity-70">({carData.pagination.totalItems})</span>}
                        </button>
                        <button
                            onClick={() => setMode('users')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                mode === 'users'
                                    ? 'bg-accent text-white'
                                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10'
                            }`}
                        >
                            <User className="w-4 h-4" />
                            Usuarios
                            {mode === 'users' && userResults.length > 0 && (
                                <span className="text-xs opacity-70">({userResults.length})</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Empty query */}
                {q.length < 2 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Search className="w-12 h-12 text-white/10 mb-4" />
                        <p className="text-white/40">Ingresá al menos 2 caracteres para buscar</p>
                    </div>
                )}

                {/* Cars mode */}
                {mode === 'cars' && q.length >= 2 && (
                    <>
                        {/* Sort controls */}
                        {!isCarLoading && carData && carData.items.length > 0 && (
                            <div className="flex items-center gap-3 mb-6">
                                <ArrowUpDown className="w-4 h-4 text-white/30" />
                                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Ordenar por:</span>
                                {(['likes', 'newest'] as CarSortBy[]).map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setCarSort(opt)}
                                        className={`px-3 py-1 text-xs rounded transition-colors ${
                                            carSort === opt
                                                ? 'bg-accent/20 text-accent border border-accent/30'
                                                : 'bg-white/5 text-white/40 hover:text-white/70 border border-white/10'
                                        }`}
                                    >
                                        {opt === 'likes' ? 'Más populares' : 'Más nuevos'}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isCarLoading && (
                            <div className="flex items-center justify-center py-24">
                                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            </div>
                        )}

                        {!isCarLoading && carData && carData.items.length > 0 && (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {carData.items.map((car, idx) => (
                                        <CarSearchCard key={car.carId} car={car} index={idx} />
                                    ))}
                                </div>
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={carData.pagination.currentPage}
                                        totalPages={carData.pagination.totalPages}
                                        totalItems={carData.pagination.totalItems}
                                        limit={carsPerPage}
                                        onPageChange={handlePageChange}
                                        onLimitChange={(newLimit) => { setCarsPerPage(newLimit); setCarPage(1); }}
                                    />
                                </div>
                            </>
                        )}

                        {!isCarLoading && carData && carData.items.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <Car className="w-12 h-12 text-white/10 mb-4" />
                                <p className="text-white/50 text-lg">No se encontraron vehículos</p>
                                <p className="text-white/30 text-sm mt-1">Probá con otro nombre, marca o serie</p>
                            </div>
                        )}
                    </>
                )}

                {/* Users mode */}
                {mode === 'users' && q.length >= 2 && (
                    <>
                        {isUserLoading && (
                            <div className="flex items-center justify-center py-24">
                                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            </div>
                        )}

                        {!isUserLoading && userResults.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {userResults.map((user) => (
                                    <motion.div
                                        key={user.userId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Link
                                            to={`/collection/${user.username}`}
                                            className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                {user.picture ? (
                                                    <img src={getOptimizedUrl(user.picture, 'thumbnail')} alt={user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-6 h-6 text-accent" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-medium truncate group-hover:text-accent transition-colors">@{user.username}</p>
                                                <p className="text-white/50 text-sm truncate">{user.firstName} {user.lastName}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {!isUserLoading && userResults.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <User className="w-12 h-12 text-white/10 mb-4" />
                                <p className="text-white/50 text-lg">No se encontraron usuarios</p>
                                <p className="text-white/30 text-sm mt-1">Probá con otro nombre de usuario</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

interface CarSearchCardProps {
    car: CarSearchResult;
    index: number;
}

function CarSearchCard({ car, index }: CarSearchCardProps) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => navigate(`/car/${car.carId}`)}
            className="group bg-[#0a0a0b] border border-white/8 rounded-xl overflow-hidden cursor-pointer hover:border-accent/30 hover:bg-white/2 transition-all"
        >
            {/* Image */}
            <div className="aspect-4/3 relative overflow-hidden bg-white/5">
                {car.picture ? (
                    <img
                        src={getOptimizedUrl(car.picture, 'card')}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-8 h-8 text-white/10" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <p className="text-white font-medium text-sm truncate group-hover:text-accent transition-colors">{car.name}</p>
                <p className="text-white/40 text-xs truncate mt-0.5">{car.brand}</p>
                <div className="flex items-center justify-between mt-2">
                    <Link
                        to={`/collection/${car.ownerUsername}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 min-w-0 group/owner"
                    >
                        <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden shrink-0">
                            {car.ownerAvatar ? (
                                <img src={getOptimizedUrl(car.ownerAvatar, 'thumbnail')} alt={car.ownerUsername} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-2.5 h-2.5 text-accent" />
                            )}
                        </div>
                        <span className="text-white/30 text-xs truncate group-hover/owner:text-accent transition-colors">@{car.ownerUsername}</span>
                    </Link>
                    {car.likesCount > 0 && (
                        <span className="flex items-center gap-1 text-white/30 text-xs shrink-0">
                            <Heart className="w-3 h-3" />
                            {car.likesCount}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
