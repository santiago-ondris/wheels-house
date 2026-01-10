import { motion } from "framer-motion";
import { Code, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function ContributorsPage() {
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
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <Code size={40} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                        Amigos <span className="text-emerald-400">Colaboradores</span>
                    </h1>

                    <div className="max-w-2xl mx-auto py-12 border-y border-white/10 my-8">
                        <p className="text-2xl md:text-3xl font-medium text-white/80 leading-relaxed italic flex items-center justify-center gap-2">
                            Aca van a estar los que nos ayudaron con la creacion de la app <Heart className="text-red-500 fill-red-500" />
                        </p>
                    </div>

                    <p className="text-white/40 text-lg">
                        Cada línea de código, cada foto subida y cada dato corregido ayuda a que Wheels House sea mejor para todos. El reconocimiento está en camino.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
