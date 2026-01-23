import { motion } from "framer-motion";
import { User, Car, Trophy, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { FeedItemDto } from "../../services/social.service";

interface FeedItemProps {
    item: FeedItemDto;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'AHORA';
    if (minutes < 60) return `${minutes}M`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}H`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}D`;

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).toUpperCase();
};

export default function FeedItem({ item }: FeedItemProps) {
    const renderIcon = () => {
        switch (item.type) {
            case 'car_added': return <Car size={16} className="text-accent" />;
            case 'milestone_reached': return <Trophy size={16} className="text-amber-400" />;
            case 'wishlist_achieved': return <Star size={16} className="text-emerald-400" />;
            case 'group_created': return <Users size={16} className="text-blue-400" />;
            default: return <Star size={16} className="text-white/40" />;
        }
    };

    const renderContent = () => {
        switch (item.type) {
            case 'car_added':
                return (
                    <p className="text-white/80 text-sm font-mono leading-tight">
                        agregó <span className="text-white font-bold">{item.metadata?.carName || 'un nuevo auto'}</span> a su colección
                    </p>
                );
            case 'milestone_reached':
                return (
                    <p className="text-white/80 text-sm font-mono leading-tight">
                        ¡alcanzó el hito de <span className="text-amber-400 font-black">{item.metadata?.milestone} autos</span>!
                    </p>
                );
            case 'wishlist_achieved':
                return (
                    <p className="text-white/80 text-sm font-mono leading-tight">
                        consiguió <span className="text-emerald-400 font-bold">{item.metadata?.carName}</span> de su lista de deseos
                    </p>
                );
            case 'group_created':
                return (
                    <p className="text-white/80 text-sm font-mono leading-tight">
                        creó el grupo <span className="text-blue-400 font-bold">{item.metadata?.groupName}</span> con {item.metadata?.carCount} autos
                    </p>
                );
            default:
                return <p className="text-white/60 text-sm font-mono">{item.type}</p>;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            className="group relative flex gap-4 p-4 bg-zinc-900/40 border border-zinc-800 transition-all hover:bg-zinc-800/60 hover:border-zinc-700"
        >
            {/* User Avatar */}
            <Link to={`/collection/${item.username}`} className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
                    {item.userPicture ? (
                        <img src={item.userPicture} alt={item.username} className="w-full h-full object-cover" />
                    ) : (
                        <User size={20} className="text-zinc-600" />
                    )}
                </div>
            </Link>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Link
                            to={`/collection/${item.username}`}
                            className="text-xs font-black text-white hover:text-accent transition-colors truncate uppercase tracking-wider"
                        >
                            {item.username}
                        </Link>
                        <span className="text-zinc-600 text-[10px]">•</span>
                        <div className="flex items-center gap-1.5 opacity-80">
                            {renderIcon()}
                        </div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 flex-shrink-0 tracking-widest uppercase">
                        {formatDate(item.createdAt)}
                    </span>
                </div>

                <div className="pr-4">
                    {renderContent()}
                </div>

                {/* Optional Action Link */}
                <div className="mt-2 flex items-center justify-end">
                    {item.carId && (
                        <Link
                            to={`/car/${item.carId}`}
                            className="text-[9px] font-mono text-zinc-500 hover:text-white flex items-center gap-1 transition-colors tracking-tighter"
                        >
                            [ VER_DETALLE ]
                        </Link>
                    )}
                    {item.groupId && (
                        <Link
                            to={`/collection/${item.username}/group/${item.metadata?.groupName}`}
                            className="text-[9px] font-mono text-zinc-500 hover:text-white flex items-center gap-1 transition-colors tracking-tighter"
                        >
                            [ VER_GRUPO ]
                        </Link>
                    )}
                </div>
            </div>

            {/* Accent Highlight Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all opacity-0 group-hover:opacity-100 ${item.type === 'milestone_reached' ? 'bg-amber-400' :
                item.type === 'wishlist_achieved' ? 'bg-emerald-400' : 'bg-accent'
                }`} />
        </motion.div>
    );
}
