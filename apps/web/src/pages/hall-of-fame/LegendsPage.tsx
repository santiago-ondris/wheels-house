import { motion } from "framer-motion";
import { Star, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function LegendsPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-[80vh] py-12 px-6">
            <div className="container mx-auto max-w-4xl">
                <Link
                    to="/hall-of-fame"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al Salón
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-b from-white/10 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-amber-500)_0%,_transparent_70%)] opacity-5 pointer-events-none" />

                    <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-8 relative z-10">
                        <Star size={40} className="fill-amber-400" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter relative z-10">
                        <span className="text-amber-400">Leyendas</span> Vivientes
                    </h1>

                    <div className="max-w-2xl mx-auto py-12 border-y border-white/10 my-8 relative z-10">
                        <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-200 leading-relaxed italic uppercase">
                            Solo personas destacadas van a lograr estar aca, todo a su tiempo.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 relative z-10 mb-8">
                        <Shield className="text-amber-400/20" size={32} />
                        <Shield className="text-amber-400/40" size={32} />
                        <Shield className="text-amber-400/20" size={32} />
                    </div>

                    <p className="text-white/40 text-lg relative z-10">
                        El estatus de Leyenda no se pide, se gana. No va a ser unicamente nuestra decisión, sino la de la comunidad.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
