import { useState, useEffect } from "react";
import { Search, Loader2, User, Clock, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchUsers, BasicUser, getSearchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } from "../../services/profile.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

interface MobileUserSearchProps {
    onClose: () => void;
}

export default function MobileUserSearch({ onClose }: MobileUserSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<BasicUser[]>([]);
    const [history, setHistory] = useState<BasicUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            setIsLoadingHistory(true);
            getSearchHistory()
                .then(setHistory)
                .catch(console.error)
                .finally(() => setIsLoadingHistory(false));
        } else {
            setIsLoadingHistory(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await searchUsers(query);
                setResults(data);
            } catch (error) {
                console.error("Error searching users:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectUser = async (username: string) => {
        if (isAuthenticated) {
            addToSearchHistory(username).catch(console.error);
        }
        onClose();
        navigate(`/collection/${username}`);
    };

    const handleRemoveFromHistory = async (e: React.MouseEvent, username: string) => {
        e.stopPropagation();
        try {
            await removeFromSearchHistory(username);
            setHistory(prev => prev.filter(u => u.username !== username));
            toast.success("Búsqueda eliminada");
        } catch (error) {
            console.error("Error removing from history:", error);
            toast.error("Error al eliminar");
        }
    };

    const handleClearHistory = async () => {
        try {
            await clearSearchHistory();
            setHistory([]);
            toast.success("Historial eliminado");
        } catch (error) {
            console.error("Error clearing history:", error);
            toast.error("Error al limpiar historial");
        }
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
    };

    const showHistory = query.length === 0 && isAuthenticated && history.length > 0;
    const showResults = query.length >= 2 && results.length > 0;
    const showNoResults = query.length >= 2 && !isLoading && results.length === 0;
    const showEmptyState = query.length === 0 && (!isAuthenticated || history.length === 0) && !isLoadingHistory;

    return (
        <div className="fixed inset-0 z-[9999] bg-[#0F0F23] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-[#0F0F23]">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar usuario..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={clearSearch}
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
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto bg-[#0F0F23]">
                {isLoadingHistory && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    </div>
                )}

                {showHistory && (
                    <div>
                        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-white/30" />
                                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                                    Búsquedas recientes
                                </span>
                            </div>
                            <button
                                onClick={handleClearHistory}
                                className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" />
                                Limpiar todo
                            </button>
                        </div>
                        <ul>
                            {history.map((user) => (
                                <li key={user.userId}>
                                    <div className="flex items-center border-b border-white/5">
                                        <button
                                            onClick={() => handleSelectUser(user.username)}
                                            className="flex-1 text-left px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors flex items-center gap-4"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                {user.picture ? (
                                                    <img src={user.picture} alt={user.username} className="w-full h-full object-cover" />
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
                                            onClick={(e) => handleRemoveFromHistory(e, user.username)}
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

                {showResults && (
                    <ul>
                        {results.map((user) => (
                            <li key={user.userId}>
                                <button
                                    onClick={() => handleSelectUser(user.username)}
                                    className="w-full text-left px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors flex items-center gap-4 border-b border-white/5"
                                >
                                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                        {user.picture ? (
                                            <img src={user.picture} alt={user.username} className="w-full h-full object-cover" />
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

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    </div>
                )}

                {showNoResults && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-white/20" />
                        </div>
                        <p className="text-white/50 text-center">No se encontraron usuarios</p>
                        <p className="text-white/30 text-sm text-center mt-1">Intenta con otro nombre</p>
                    </div>
                )}

                {showEmptyState && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-white/20" />
                        </div>
                        <p className="text-white/50 text-center">Busca coleccionistas</p>
                        <p className="text-white/30 text-sm text-center mt-1">Escribe al menos 2 caracteres</p>
                    </div>
                )}
            </div>
        </div>
    );
}

