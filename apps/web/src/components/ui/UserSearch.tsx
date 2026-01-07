import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchUsers, BasicUser } from "../../services/profile.service";

interface UserSearchProps {
    className?: string;
    autoFocus?: boolean;
    onClose?: () => void;
    variant?: "desktop" | "mobile";
}

export default function UserSearch({ className = "", autoFocus = false, onClose, variant = "desktop" }: UserSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<BasicUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true);
                try {
                    const data = await searchUsers(query);
                    setResults(data);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Error searching users:", error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectUser = (username: string) => {
        setIsOpen(false);
        setQuery("");
        if (onClose) onClose();
        navigate(`/collection/${username}`);
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
                    className={`w-full bg-white/10 border border-white/10 rounded-lg py-2 pl-9 pr-8 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all ${variant === "mobile" ? "text-lg py-3" : "text-sm"
                        }`}
                    autoFocus={autoFocus}
                    onFocus={() => {
                        if (query.length >= 2 && results.length > 0) setIsOpen(true);
                    }}
                />
                {isLoading ? (
                    <Loader2 className="absolute right-3 w-4 h-4 text-white/50 animate-spin" />
                ) : query ? (
                    <button
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                            if (autoFocus) {
                                // ver
                            }
                        }}
                        className="absolute right-3 hover:text-white text-white/50 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                ) : null}
            </div>

            {/* Dropdown Results */}
            {isOpen && (query.length >= 2) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {results.length > 0 ? (
                        <ul className="py-2 max-h-[60vh] overflow-y-auto">
                            {results.map((user) => (
                                <li key={user.userId}>
                                    <button
                                        onClick={() => handleSelectUser(user.username)}
                                        className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10">
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
                        <div className="px-4 py-8 text-center text-white/50">
                            <p className="text-sm">No se encontraron usuarios.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
