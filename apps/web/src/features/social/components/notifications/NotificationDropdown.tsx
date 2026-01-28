import { useRef, useEffect, RefObject } from 'react';
import { CheckCheck, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import { useNotifications } from '../../hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface NotificationDropdownProps {
    onClose: () => void;
    triggerRef: RefObject<any>;
}

export default function NotificationDropdown({ onClose, triggerRef }: NotificationDropdownProps) {
    const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications(10);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const isClickInsideTrigger = triggerRef.current?.contains(event.target as Node);
            const isClickInsideDropdown = dropdownRef.current?.contains(event.target as Node);

            if (!isClickInsideTrigger && !isClickInsideDropdown) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose, triggerRef]);

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        toast.success("Marcadas como leídas", {
            duration: 2000,
            style: {
                background: '#1a1a1b',
                color: '#fff',
                fontSize: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        });
    };

    return (
        <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-14 right-0 w-[400px] bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
        >
            <div className="flex items-center justify-between p-4 border-b border-white/[0.05] bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <h3 className="font-bold text-white text-sm tracking-wide">NOTIFICACIONES</h3>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-white/40 hover:text-accent transition-colors flex items-center gap-1 uppercase tracking-tighter"
                    >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Marcar leídas
                    </button>
                )}
            </div>

            <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-[#0a0a0b]">
                <AnimatePresence mode="popLayout">
                    {isLoading && notifications.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-3" />
                            <p className="text-xs text-white/30 font-medium">Buscando actualizaciones...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20">
                                <Bell className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-white/40">No hay novedades por ahora</p>
                        </div>
                    ) : (
                        notifications.map((notification, index) => (
                            <motion.div
                                key={notification.notificationId}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                layout
                            >
                                <NotificationItem
                                    notification={notification}
                                    onRead={() => markAsRead(notification.notificationId)}
                                    onCloseDropdown={onClose}
                                />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="p-3 border-t border-white/[0.05] bg-white/[0.02]">
                <button
                    onClick={() => {
                        onClose();
                        navigate('/notifications');
                    }}
                    className="w-full py-2.5 text-[11px] font-bold text-white/40 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all uppercase tracking-widest"
                >
                    Ver todo el historial
                </button>
            </div>
        </motion.div>
    );
}
