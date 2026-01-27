import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCheck, Bell } from "lucide-react";
import { useNotifications } from "../features/social/hooks/useNotifications";
import NotificationItem from "../features/social/components/notifications/NotificationItem";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { notifications, isLoading, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        toast.success("Todas las notificaciones marcadas como leídas", {
            style: {
                background: '#1a1a1b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        });
    };

    return (
        <div className="min-h-screen text-white bg-[#050505] selection:bg-accent/30 overflow-x-hidden">
            <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-accent/5 via-accent/[0.01] to-transparent pointer-events-none z-0" />

            <div className="container mx-auto px-6 pt-4 pb-24 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-4 group"
                    >
                        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Volver</span>
                    </motion.button>

                    <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]"
                            >
                                Notifica<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">ciones</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] max-w-md pt-2"
                            >
                                Notificaciones de likes, seguidores, hitos.
                            </motion.p>
                        </div>

                        {notifications.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handleMarkAllRead}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-2xl transition-all text-xs font-bold uppercase tracking-widest active:scale-95 shrink-0"
                            >
                                <CheckCheck className="w-4 h-4 text-accent" />
                                Marcar leídas
                            </motion.button>
                        )}
                    </header>

                    <div className="flex justify-center">
                        <div className="w-full max-w-2xl border-x border-white/5 bg-[#050505] min-h-[400px]">
                            {isLoading && notifications.length === 0 ? (
                                <div className="py-24 text-center flex flex-col items-center">
                                    <div className="relative">
                                        <div className="w-14 h-14 border-2 border-accent/10 border-t-accent rounded-full animate-spin" />
                                        <Bell className="w-6 h-6 text-accent/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.4em] mt-8 animate-pulse italic">
                                        Sincronizando actualizaciones...
                                    </p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-32 text-center px-10"
                                >
                                    <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-white/5 group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Bell className="w-10 h-10 text-zinc-700" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 tracking-[-0.05em]">Silencio Total</h2>
                                    <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest leading-relaxed max-w-sm mx-auto mb-12">
                                        No tenes notificaciones nuevas. Unite a la conversacion para ver mas actividad por aca.
                                    </p>
                                    <button
                                        onClick={() => navigate('/community')}
                                        className="px-10 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-accent hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                                    >
                                        Ir a la Comunidad
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    <AnimatePresence mode="popLayout">
                                        {notifications.map((notification, index) => (
                                            <motion.div
                                                key={notification.notificationId}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: index * 0.04 }}
                                                layout
                                            >
                                                <NotificationItem
                                                    notification={notification}
                                                    onRead={() => markAsRead(notification.notificationId)}
                                                    onCloseDropdown={() => { }}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mb-48" />
            <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -ml-48 -mt-48" />
        </div>
    );
}
