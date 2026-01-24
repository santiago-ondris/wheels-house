import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect } from "react";

interface NewActivityIndicatorProps {
    show: boolean;
    onClick: () => void;
    onHide: () => void;
}

export default function NewActivityIndicator({ show, onClick, onHide }: NewActivityIndicatorProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onHide();
            }, 7000); // Hide after 7 seconds
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    return (
        <AnimatePresence>
            {show && (
                <div className="sticky top-16 z-20 flex justify-center w-full pointer-events-none mb-[-40px]">
                    <motion.button
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        onClick={onClick}
                        className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors group"
                    >
                        <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Nuevas actividades
                        </span>
                    </motion.button>
                </div>
            )}
        </AnimatePresence>
    );
}
