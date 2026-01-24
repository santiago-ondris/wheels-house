import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, User } from "lucide-react";
import { searchUsers, BasicUser } from "../../services/profile.service";

interface FeedUserSearchProps {
    onSelectUser: (user: { userId: number, username: string } | null) => void;
    selectedUser: { userId: number, username: string } | null;
}

export default function FeedUserSearch({ onSelectUser, selectedUser }: FeedUserSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<BasicUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

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

    const handleSelectUser = (user: BasicUser) => {
        onSelectUser({ userId: user.userId, username: user.username });
        setIsOpen(false);
        setQuery("");
    };

    const handleClearSelection = () => {
        onSelectUser(null);
    };

    return (
        <div ref={searchRef} className="relative w-full">
            {selectedUser ? (
                <div className="flex items-center justify-between bg-accent/10 border border-accent/20 rounded-xl py-2 px-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                            <User className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-xs font-mono text-white">@{selectedUser.username}</span>
                    </div>
                    <button 
                        onClick={handleClearSelection}
                        className="p-1 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="relative group">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isOpen ? 'text-accent' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
                    <input
                        type="text"
                        placeholder="Filtrar por usuario..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="w-full bg-zinc-900/50 border border-white/5 focus:border-accent/30 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all shadow-inner"
                    />
                    {isLoading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 text-accent animate-spin" />
                        </div>
                    )}

                    {/* Dropdown Results */}
                    {isOpen && query.length >= 2 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                            {results.length > 0 ? (
                                <ul className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    {results.map((user) => (
                                        <li key={user.userId}>
                                            <button
                                                onClick={() => handleSelectUser(user)}
                                                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-4 group border-b border-white/5 last:border-0"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                    {user.picture ? (
                                                        <img src={user.picture} alt={user.username} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-4 h-4 text-zinc-500 group-hover:text-accent transition-colors" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium text-xs group-hover:text-accent transition-colors">@{user.username}</p>
                                                    <p className="text-[10px] text-zinc-500 line-clamp-1">{user.firstName} {user.lastName}</p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !isLoading && (
                                    <div className="px-4 py-8 text-center text-zinc-600">
                                        <p className="text-xs font-mono uppercase tracking-widest">Sin resultados</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
