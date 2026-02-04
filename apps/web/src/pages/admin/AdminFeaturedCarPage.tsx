import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    Search,
    Loader2,
    Check,
    Car,
    User,
    Palette,
} from "lucide-react";
import {
    getFeaturedCarSetting,
    setFeaturedCarSetting,
    searchCarsAdmin,
    FeaturedCarSetting,
    CarSearchResult,
} from "../../services/admin.service";
import toast from "react-hot-toast";
import { getOptimizedUrl } from "../../lib/cloudinary";

export default function AdminFeaturedCarPage() {
    const [currentFeatured, setCurrentFeatured] = useState<FeaturedCarSetting | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<CarSearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedCar, setSelectedCar] = useState<CarSearchResult | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        loadCurrentFeatured();
    }, []);

    const loadCurrentFeatured = async () => {
        setLoading(true);
        try {
            const result = await getFeaturedCarSetting();
            setCurrentFeatured(result);
        } catch (error) {
            console.error("Error loading featured car:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const results = await searchCarsAdmin(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching cars:", error);
            toast.error("Error al buscar autos");
        } finally {
            setSearching(false);
        }
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            handleSearch(searchQuery);
        }, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery, handleSearch]);

    const handleSave = async () => {
        if (!selectedCar) return;
        setSaving(true);
        try {
            await setFeaturedCarSetting(selectedCar.carId);
            toast.success("Auto destacado actualizado");
            await loadCurrentFeatured();
            setSelectedCar(null);
            setSearchQuery("");
            setSearchResults([]);
        } catch (error) {
            console.error("Error saving featured car:", error);
            toast.error("Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    const handleSelectCar = (car: CarSearchResult) => {
        setSelectedCar(car);
        setSearchResults([]);
        setSearchQuery("");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white pt-12 pb-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                        <Star className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-accent">ADMIN_CONTROL</span>
                    </div>
                    <h1 className="text-4xl font-mono font-black uppercase tracking-tighter">
                        AUTO <span className="text-white/40">DEL_MES</span>
                    </h1>
                    <p className="text-white/40 font-mono text-sm">
                        Seleccioná manualmente qué auto se muestra como "Elegido del mes" en la homepage
                    </p>
                </div>

                {/* Current Featured Car */}
                <div className="space-y-4">
                    <h2 className="text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em]">
                        AUTO_ACTUAL
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <Loader2 className="w-6 h-6 text-accent animate-spin" />
                        </div>
                    ) : currentFeatured ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-white/[0.02] border border-accent/20 rounded-2xl"
                        >
                            <div className="flex gap-6">
                                {currentFeatured.pictures?.[0] && (
                                    <img
                                        src={getOptimizedUrl(currentFeatured.pictures[0], 'thumbnail')}
                                        alt={currentFeatured.name}
                                        className="w-32 h-32 object-cover rounded-xl"
                                    />
                                )}
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-2xl font-mono font-black tracking-tighter">
                                        {currentFeatured.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm font-mono">
                                        <span className="text-white/60">
                                            <span className="text-accent">@</span>{currentFeatured.ownerUsername}
                                        </span>
                                        <span className="text-white/40">{currentFeatured.brand}</span>
                                        <span className="text-white/40">{currentFeatured.manufacturer}</span>
                                    </div>
                                    {currentFeatured.series && (
                                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-mono font-black uppercase rounded-full">
                                            {currentFeatured.series}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                            <Car className="w-8 h-8 text-white/10 mb-4" />
                            <p className="text-xs font-mono text-white/20 uppercase tracking-widest">
                                Ningún auto configurado (se usa rotación automática)
                            </p>
                        </div>
                    )}
                </div>

                {/* Search Section */}
                <div className="space-y-4">
                    <h2 className="text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.2em]">
                        SELECCIONAR_NUEVO
                    </h2>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscá un auto por nombre..."
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-12 pr-4 py-4 font-mono text-sm focus:border-accent/50 outline-none transition-all placeholder:text-white/20"
                        />
                        {searching && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent animate-spin" />
                        )}
                    </div>

                    {/* Search Results */}
                    <AnimatePresence>
                        {searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-[#0f0f11] border border-white/10 rounded-xl overflow-hidden max-h-80 overflow-y-auto"
                            >
                                {searchResults.map((car) => (
                                    <button
                                        key={car.carId}
                                        onClick={() => handleSelectCar(car)}
                                        className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 text-left"
                                    >
                                        {car.picture ? (
                                            <img
                                                src={getOptimizedUrl(car.picture, 'thumbnail')}
                                                alt={car.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
                                                <Car className="w-6 h-6 text-white/20" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-mono font-bold text-sm truncate">{car.name}</h4>
                                            <div className="flex items-center gap-3 text-xs font-mono text-white/40 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    @{car.ownerUsername}
                                                </span>
                                                <span>{car.brand}</span>
                                                <span className="flex items-center gap-1">
                                                    <Palette className="w-3 h-3" />
                                                    {car.color}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Selected Car Preview */}
                    <AnimatePresence>
                        {selectedCar && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-4"
                            >
                                <div className="flex items-center gap-2 text-emerald-500">
                                    <Check className="w-5 h-5" />
                                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em]">
                                        SELECCIONADO
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {selectedCar.picture && (
                                        <img
                                            src={getOptimizedUrl(selectedCar.picture, 'thumbnail')}
                                            alt={selectedCar.name}
                                            className="w-20 h-20 object-cover rounded-xl"
                                        />
                                    )}
                                    <div>
                                        <h3 className="text-xl font-mono font-black">{selectedCar.name}</h3>
                                        <p className="text-sm font-mono text-white/60">
                                            <span className="text-accent">@</span>{selectedCar.ownerUsername} • {selectedCar.brand}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full py-4 bg-accent text-dark font-mono font-black text-sm uppercase rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Star className="w-5 h-5" />
                                    )}
                                    Guardar como Auto del Mes
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
