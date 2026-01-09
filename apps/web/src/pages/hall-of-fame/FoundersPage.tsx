import { motion } from "framer-motion";
import { Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function FoundersPage() {
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
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center"
                >
                    <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <Users size={40} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                        Nuestros <span className="text-blue-400">Fundadores</span>
                    </h1>

                    <div className="max-w-2xl mx-auto py-12 border-y border-white/10 my-8">
                        <p className="text-2xl md:text-3xl font-medium text-white/80 leading-relaxed italic">
                            Aca van a estar los primeros 100 usuarios de Wheels House
                        </p>
                    </div>

                    <p className="text-white/40 text-lg">
                        Estamos preparando este muro para aquellos que pusieron la primera piedra en esta comunidad. Pronto van a estar sus nombres.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
