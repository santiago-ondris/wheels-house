import { useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useNavigate } from 'react-router-dom';
import { useUnreadCount } from '../../hooks/useUnreadCount';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const { count } = useUnreadCount();
    const navigate = useNavigate();

    const handleToggle = () => {
        if (window.innerWidth < 768) {
            navigate('/notifications');
            return;
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <motion.button
                ref={triggerRef}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                className={`p-2.5 rounded-xl transition-all duration-300 relative group ${isOpen
                    ? 'bg-accent text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
            >
                <div className="relative">
                    <Bell className={`w-5 h-5 transition-transform duration-500 ${count > 0 && !isOpen ? 'group-hover:rotate-12' : ''}`} />

                    {count > 0 && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background"
                            >
                                {count > 9 ? '9+' : count}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <NotificationDropdown
                        onClose={() => setIsOpen(false)}
                        triggerRef={triggerRef}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
