import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { getFounders } from '../services/profile.service';
import { useAuth } from '../contexts/AuthContext';
import EarlyAccessInfoModal from './auth/EarlyAccessInfoModal';

export default function GuestEarlyAccessBanner() {
    const [foundersCount, setFoundersCount] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const BANNER_HEIGHT = '36px';

    useEffect(() => {
        if (isAuthenticated) {
            document.documentElement.style.setProperty('--banner-height', '0px');
            return;
        }

        const fetchFounders = async () => {
            try {
                const founders = await getFounders();
                setFoundersCount(founders.length);
                if (founders.length < 100 && isVisible) {
                    document.documentElement.style.setProperty('--banner-height', BANNER_HEIGHT);
                } else {
                    document.documentElement.style.setProperty('--banner-height', '0px');
                }
            } catch (error) {
                console.error("Error fetching founders count for banner:", error);
                document.documentElement.style.setProperty('--banner-height', '0px');
            }
        };
        fetchFounders();

        return () => {
            document.documentElement.style.setProperty('--banner-height', '0px');
        };
    }, [isAuthenticated, isVisible]);

    if (isAuthenticated || !isVisible || (foundersCount !== null && foundersCount >= 100)) {
        return null;
    }

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: BANNER_HEIGHT, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[#0a0a0b] fixed top-0 left-0 w-full overflow-hidden z-[60] border-b border-white/5"
                >
                    <div className="container mx-auto px-4 h-full relative flex items-center justify-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                        >
                            <Sparkles className="w-3 h-3 text-accent" />
                            <p className="font-mono text-[9px] md:text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                Acceso anticipado <span className="text-accent ml-1 underline underline-offset-2 decoration-accent/30 group-hover:decoration-accent transition-all">Saber más</span>
                            </p>
                            <ChevronRight className="w-3 h-3 text-accent/50 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute right-4 p-1 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
                            aria-label="Cerrar aviso"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>

            <EarlyAccessInfoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                foundersCount={foundersCount}
            />
        </>
    );
}
