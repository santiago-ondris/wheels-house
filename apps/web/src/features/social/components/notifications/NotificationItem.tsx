import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Heart, Users2, Trophy, Star, MessageCircle, ChevronRight } from 'lucide-react';
import { Notification } from './types';
import { useAuth } from '../../../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface NotificationItemProps {
    notification: Notification;
    onRead: () => void;
    onCloseDropdown: () => void;
}

export default function NotificationItem({ notification, onRead, onCloseDropdown }: NotificationItemProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleClick = () => {
        onRead();
        onCloseDropdown();

        switch (notification.type) {
            case 'new_follower':
                if (notification.actor?.username) {
                    navigate(`/collection/${notification.actor.username}`);
                }
                break;
            case 'car_liked':
                if (notification.carId) {
                    navigate(`/car/${notification.carId}`);
                }
                break;
            case 'group_liked':
                const groupName = notification.metadata?.groupName;
                if (groupName && user?.username) {
                    navigate(`/collection/${user.username}/group/${groupName}`);
                }
                break;
            case 'milestone_reached':
                if (user?.username) {
                    navigate(`/collection/${user.username}`);
                }
                break;
        }
    };

    const getIcon = () => {
        const iconClass = "w-4 h-4";
        switch (notification.type) {
            case 'new_follower':
                return <div className="p-2 bg-blue-500/20 rounded-lg"><Users2 className={`${iconClass} text-blue-400`} /></div>;
            case 'car_liked':
            case 'group_liked':
                return <div className="p-2 bg-red-500/20 rounded-lg"><Heart className={`${iconClass} text-red-500`} /></div>;
            case 'milestone_reached':
                return <div className="p-2 bg-yellow-500/20 rounded-lg"><Trophy className={`${iconClass} text-yellow-500`} /></div>;
            case 'wishlist_match':
                return <div className="p-2 bg-purple-500/20 rounded-lg"><Star className={`${iconClass} text-purple-400`} /></div>;
            default:
                return <div className="p-2 bg-gray-500/20 rounded-lg"><MessageCircle className={`${iconClass} text-gray-400`} /></div>;
        }
    };

    const getMessageText = () => {
        switch (notification.type) {
            case 'new_follower':
                return 'te ha seguido recientemente';
            case 'car_liked':
                return (
                    <span>
                        le gustó tu auto <span className="text-white font-medium">{notification.metadata?.carName || 'destacado'}</span>
                    </span>
                );
            case 'group_liked':
                return (
                    <span>
                        le gustó tu grupo <span className="text-white font-medium">{notification.metadata?.groupName || 'de colección'}</span>
                    </span>
                );
            case 'milestone_reached':
                return `¡Increíble! Alcanzaste el hito de ${notification.metadata?.milestone || 0} autos en tu garaje.`;
            case 'wishlist_match':
                return `agregó ${notification.metadata?.carName || 'un auto'} de tu wishlist`;
            default:
                return 'Tienes una nueva actualización en tu perfil';
        }
    };

    return (
        <motion.div
            whileHover={{ x: 4 }}
            onClick={handleClick}
            className={`group relative p-5 flex gap-4 transition-all duration-300 last:border-0 cursor-pointer overflow-hidden ${!notification.read ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'
                }`}
        >
            {/* Unread Indicator Bar */}
            {!notification.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_12px_rgba(239,68,68,0.5)]" />
            )}

            {/* Avatar / Icon container */}
            <div className="relative flex-shrink-0">
                {notification.actor ? (
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        {notification.actor.picture ? (
                            <img
                                src={notification.actor.picture}
                                alt={notification.actor.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent font-bold text-lg uppercase">
                                {notification.actor.username.charAt(0)}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-2xl bg-white/5 text-white/40">
                        {getIcon()}
                    </div>
                )}

                {/* Micro-badge icon for actor notifications */}
                {notification.actor && (
                    <div className="absolute -bottom-1 -right-1 ring-4 ring-black rounded-full overflow-hidden">
                        {getIcon()}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-sm leading-relaxed text-white/60">
                    {notification.type === 'milestone_reached' ? (
                        <span className="font-bold text-accent inline-flex items-center gap-1.5 mb-0.5 uppercase tracking-wider text-[10px]">
                            <Trophy className="w-3 h-3" />
                            Logro Desbloqueado
                        </span>
                    ) : (
                        <span
                            className="font-bold text-white hover:text-accent transition-colors transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (notification.actor?.username) navigate(`/collection/${notification.actor.username}`);
                            }}
                        >
                            @{notification.actor?.username || `Usuario #${notification.actorId}`}
                        </span>
                    )}{' '}
                    <span className="text-white/70">{getMessageText()}</span>
                </div>

                <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] font-medium text-white/30 uppercase tracking-tight">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
                    </span>
                    {!notification.read && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[11px] font-bold text-accent uppercase tracking-tighter">Nuevo</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 transform duration-300">
                <ChevronRight className="w-5 h-5 text-white/20" />
            </div>
        </motion.div>
    );
}
