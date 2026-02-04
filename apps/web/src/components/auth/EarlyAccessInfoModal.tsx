import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EarlyAccessInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    foundersCount: number | null;
}

export default function EarlyAccessInfoModal({ isOpen, onClose, foundersCount }: EarlyAccessInfoModalProps) {
    const navigate = useNavigate();

    const handleRegister = () => {
        onClose();
        navigate('/register');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header Image/Background */}
                        <div className="h-32 bg-accent/10 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0b]" />
                            <Sparkles className="w-12 h-12 text-accent animate-pulse" />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="px-8 pb-8 pt-2 text-center">
                            <h3 className="text-2xl font-mono font-black text-white uppercase tracking-tight mb-2">
                                Acceso Anticipado
                            </h3>

                            <div className="flex justify-center mb-6">
                                <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                                    <span className="text-[10px] font-mono font-black text-accent uppercase tracking-widest">
                                        {foundersCount !== null ? `${foundersCount}/100 LUGARES OCUPADOS` : 'MIEMBROS FUNDADORES'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-white/60 font-mono text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                                Wheels House está en fase de lanzamiento. Los primeros 100 usuarios en registrarse obtendrán estatus de <span className="text-white underline underline-offset-4 decoration-accent">Miembro Fundador</span>, lo que garantiza acceso <span className="text-white font-bold">GRATUITO POR SIEMPRE</span> a todas las funciones premium.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-accent" />
                                    <span className="text-[10px] font-mono text-white/40 uppercase font-black">Acceso Vitalicio</span>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col items-center gap-2">
                                    <Zap className="w-5 h-5 text-accent" />
                                    <span className="text-[10px] font-mono text-white/40 uppercase font-black">Sin Suscripciones</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleRegister}
                                    className="w-full py-4 bg-accent text-dark font-mono font-black uppercase tracking-widest -skew-x-12 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="skew-x-12 flex items-center gap-2">
                                        Crear mi cuenta gratis
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate('/early-access');
                                    }}
                                    className="w-full py-3 text-white/30 hover:text-white font-mono text-[11px] uppercase tracking-widest transition-colors"
                                >
                                    Ver detalle
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
