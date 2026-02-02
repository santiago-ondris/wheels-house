import { motion } from "framer-motion";
import { Car, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col items-center justify-start pt-12 md:pt-24 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center space-y-8"
            >
                <div className="relative inline-block">
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -10, 10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="bg-red-500/10 p-6 rounded-full border border-red-500/20"
                    >
                        <Car className="w-16 h-16 text-red-500" />
                    </motion.div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-mono font-black uppercase tracking-tighter">
                        ACCESO_DENEGADO
                    </h1>
                    <div className="h-1 w-20 bg-red-500 mx-auto" />
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest leading-relaxed">
                        No tenés los permisos necesarios para acceder a esta sección restringida.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-[10px] font-black uppercase hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver atrás
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-dark rounded-xl font-mono text-[10px] font-black uppercase hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Ir al inicio
                    </button>
                </div>

                <div className="pt-12 flex justify-center gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1 h-4 bg-white/5 rounded-full" />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
