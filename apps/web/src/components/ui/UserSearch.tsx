import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, User, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchUsers, BasicUser, getSearchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } from "../../services/profile.service";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

interface UserSearchProps {
    className?: string;
}

export default function UserSearch({ className = "" }: UserSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<BasicUser[]>([]);
    const [history, setHistory] = useState<BasicUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Cargar historial cuando se abre el dropdown
    useEffect(() => {
        if (isAuthenticated && isOpen && query.length === 0) {
            getSearchHistory().then(setHistory).catch(console.error);
        }
    }, [isAuthenticated, isOpen, query]);

    // Buscar usuarios con debounce
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

    // Cerrar al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectUser = async (username: string) => {
        if (isAuthenticated) {
            addToSearchHistory(username).catch(console.error);
        }
        setIsOpen(false);
        setQuery("");
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

    const handleClearHistory = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await clearSearchHistory();
            setHistory([]);
            toast.success("Historial eliminado");
        } catch (error) {
            console.error("Error clearing history:", error);
            toast.error("Error al limpiar historial");
        }
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-white/50" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar usuario..."
                    className="w-full bg-white/10 border border-white/10 rounded-lg py-2 pl-9 pr-8 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    onFocus={() => setIsOpen(true)}
                />
                {isLoading ? (
                    <Loader2 className="absolute right-3 w-4 h-4 text-white/50 animate-spin" />
                ) : query ? (
                    <button
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                        }}
                        className="absolute right-3 hover:text-white text-white/50 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                ) : null}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {query.length === 0 && isAuthenticated && history.length > 0 ? (
                        <>
                            <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-sm sticky top-0 z-10">
                                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                                    Recientes
                                </span>
                                <button
                                    onClick={handleClearHistory}
                                    className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Limpiar
                                </button>
                            </div>
                            <ul className="py-2 max-h-[60vh] overflow-y-auto">
                                {history.map((user) => (
                                    <li key={user.userId}>
                                        <div className="flex items-center group border-b border-white/5 last:border-0">
                                            <button
                                                onClick={() => handleSelectUser(user.username)}
                                                className="flex-1 text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-4"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                    {user.picture ? (
                                                        <img src={user.picture} alt={user.username} className="w-full h-full object-cover" />
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
                                                onClick={(e) => handleRemoveFromHistory(e, user.username)}
                                                className="p-2 mr-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : query.length >= 2 && (
                        results.length > 0 ? (
                            <ul className="py-2 max-h-[60vh] overflow-y-auto">
                                {results.map((user) => (
                                    <li key={user.userId}>
                                        <button
                                            onClick={() => handleSelectUser(user.username)}
                                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-4 group border-b border-white/5 last:border-0"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                {user.picture ? (
                                                    <img src={user.picture} alt={user.username} className="w-full h-full object-cover" />
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
                        ) : (
                            <div className="px-4 py-12 text-center text-white/50 flex flex-col items-center gap-3">
                                <Search className="w-8 h-8 opacity-20" />
                                <p className="text-base">No se encontraron usuarios.</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

