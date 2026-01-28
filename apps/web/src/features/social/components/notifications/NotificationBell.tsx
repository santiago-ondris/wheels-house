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
                <Bell className={`w-5 h-5 transition-transform duration-500 ${count > 0 && !isOpen ? 'group-hover:rotate-12' : ''}`} />

                {count > 0 && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-4 ring-black"
                        >
                            {count > 9 ? '9+' : count}
                            {!isOpen && (
                                <motion.div
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 0, 0.5]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeOut"
                                    }}
                                    className="absolute inset-0 rounded-full bg-accent -z-10"
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
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
