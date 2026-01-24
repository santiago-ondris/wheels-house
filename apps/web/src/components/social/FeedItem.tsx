import { motion } from "framer-motion";
import { User, Car, Trophy, Star, Users, ArrowUpRight } from "lucide-react";
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
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).toUpperCase();
};

export default function FeedItem({ item }: FeedItemProps) {
    const getTheme = () => {
        switch (item.type) {
            case 'milestone_reached': return {
                icon: <Trophy size={14} />,
                color: 'text-amber-400',
                border: 'border-amber-400/20'
            };
            case 'wishlist_achieved': return {
                icon: <Star size={14} />,
                color: 'text-emerald-400',
                border: 'border-emerald-400/20'
            };
            case 'group_created': return {
                icon: <Users size={14} />,
                color: 'text-blue-400',
                border: 'border-blue-400/20'
            };
            default: return {
                icon: <Car size={14} />,
                color: 'text-accent',
                border: 'border-accent/20'
            };
        }
    };

    const theme = getTheme();
    const itemImage = item.metadata?.carImage || item.metadata?.groupImage;

    const renderHeader = () => {
        switch (item.type) {
            case 'car_added':
                return "Añadió un auto";
            case 'milestone_reached':
                return "Alcanzó un hito";
            case 'wishlist_achieved':
                return "Consiguió de su wishlist";
            case 'group_created':
                return "Creó un grupo";
            default:
                return "Actividad";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex p-4 hover:bg-white/[0.02] transition-colors group cursor-default"
        >
            {/* User Avatar - Fixed Column */}
            <div className="flex-shrink-0 mr-3">
                <Link to={`/collection/${item.username}`}>
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 overflow-hidden shadow-lg">
                        {item.userPicture ? (
                            <img
                                src={item.userPicture}
                                alt={item.username}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User size={18} className="text-zinc-700" />
                            </div>
                        )}
                    </div>
                </Link>
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
                {/* Meta Row: Username + Status + Time */}
                <div className="flex items-center gap-1.5 mb-0.5 mt-0.5">
                    <Link
                        to={`/collection/${item.username}`}
                        className="text-white text-[13px] font-black uppercase hover:underline tracking-tight"
                    >
                        {item.username}
                    </Link>
                    <span className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest">•</span>
                    <span className={`text-[9px] font-mono uppercase tracking-widest ${theme.color}`}>
                        {renderHeader()}
                    </span>
                    <span className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest">•</span>
                    <span className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                        {formatDate(item.createdAt)}
                    </span>
                </div>

                {/* Main Content Info */}
                <div className="mb-3">
                    {item.type === 'milestone_reached' ? (
                        <p className="text-white text-base font-black tracking-tighter uppercase leading-none">
                            {item.metadata?.milestone} Vehículos logrados
                        </p>
                    ) : (
                        <p className="text-white text-base font-black tracking-tighter uppercase leading-none truncate">
                            {item.metadata?.carName || item.metadata?.groupName}
                        </p>
                    )}
                </div>

                {/* Integrated Visual Component - VISIBLE ON MOBILE */}
                {itemImage && (
                    <Link to={item.carId ? `/car/${item.carId}` : `/collection/${item.username}/group/${item.metadata?.groupName}`}>
                        <div className="relative mt-2 mb-2 rounded-xl border border-white/5 overflow-hidden bg-zinc-900 aspect-video max-w-full sm:max-w-md shadow-2xl group/img">
                            <img
                                src={itemImage}
                                alt="Event visual"
                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay tag */}
                            <div className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                <ArrowUpRight size={14} className="text-white" />
                            </div>
                        </div>
                    </Link>
                )}

                {/* Actions Bar (Minimalist) */}
                <div className="flex items-center gap-4 mt-2">
                    <div className={`p-1.5 rounded-md bg-white/[0.03] ${theme.color}`}>
                        {theme.icon}
                    </div>
                    {(item.carId || item.groupId) && (
                        <Link
                            to={item.carId ? `/car/${item.carId}` : `/collection/${item.username}/group/${item.metadata?.groupName}`}
                            className="text-[9px] font-mono font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.2em]"
                        >
                            Ver detalle
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
