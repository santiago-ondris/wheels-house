import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Terminal, Cpu, ShieldCheck, Globe } from "lucide-react";

export default function AboutUsPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pb-20 bg-[#0a0a0b]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-white/40 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-mono font-bold text-white flex items-center gap-3 uppercase tracking-tighter">
                                <Terminal className="w-6 h-6 text-accent" />
                                Sobre_Nosotros
                            </h1>
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                                MODULO: CORE_INFO // ESTADO: EN_DESARROLLO
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-block px-3 py-1 bg-accent/10 border-l-2 border-accent">
                            <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.2em]">
                                PROTOCOLO_DE_APERTURA
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-mono font-bold text-white uppercase tracking-tighter leading-none">
                            Construyendo el <span className="text-accent underline decoration-accent/30 decoration-4 underline-offset-8">Almacén Digital</span> Definitivo.
                        </h2>
                        <p className="text-white/40 font-mono text-lg uppercase tracking-wide leading-relaxed">
                            Estamos preparando algo especial. Wheels House no es solo una base de datos, es el tributo digital a la pasión por el coleccionismo.
                        </p>
                    </motion.div>

                    {/* HUD Status Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 border border-white/5 bg-white/[0.02] space-y-4"
                        >
                            <Cpu className="w-8 h-8 text-accent/50" />
                            <h3 className="text-white font-mono font-bold uppercase tracking-tight">Arquitectura</h3>
                            <p className="text-white/30 text-xs font-mono uppercase tracking-widest">
                                Diseñado para la precisión. Queremos que cada coleeccionista particular pueda llevar su colección a su gusto.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 border border-white/5 bg-white/[0.02] space-y-4"
                        >
                            <ShieldCheck className="w-8 h-8 text-emerald-500/50" />
                            <h3 className="text-white font-mono font-bold uppercase tracking-tight">Integridad</h3>
                            <p className="text-white/30 text-xs font-mono uppercase tracking-widest">
                                No obviamos la seguridad de los usuarios, implementamos protocolos de seguridad para la comunidad.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 border border-white/5 bg-white/[0.02] space-y-4"
                        >
                            <Globe className="w-8 h-8 text-blue-500/50" />
                            <h3 className="text-white font-mono font-bold uppercase tracking-tight">Comunidad</h3>
                            <p className="text-white/30 text-xs font-mono uppercase tracking-widest">
                                Global y conectado. El próximo paso es habilitar la interacción entre usuarios.
                            </p>
                        </motion.div>
                    </div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="py-12 border-y border-white/5 space-y-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                                <Info className="w-5 h-5 text-accent" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-white font-mono font-black uppercase tracking-widest text-sm">Mensaje de los Desarrolladores</h4>
                                <p className="text-white/50 font-mono text-sm leading-relaxed">
                                    Wheels House nace de la necesidad de tener un control total y visual de manera rápida de nuestras propias colecciones.
                                    Actualmente nos encontramos en una fase de expansión agresiva de funcionalidades.
                                    <br /><br />
                                    Estamos puliendo la experiencia para que, cuando esta sección esté completada, no solo leas sobre nosotros,
                                    sino que entiendas por qué Wheel House es el hogar de las colecciones.
                                </p>    
                            </div>
                        </div>

                        <div className="bg-accent/5 border border-accent/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-1 text-center md:text-left">
                                <p className="text-accent font-mono font-bold text-xs uppercase tracking-[0.3em]">Estado Actual</p>
                                <p className="text-white/70 font-mono text-xl uppercase tracking-tighter">Fase de Despliegue: v0.7.4</p>
                            </div>
                            <button
                                onClick={() => navigate('/contact')}
                                className="px-6 py-3 bg-white text-black font-mono font-bold uppercase text-xs tracking-widest hover:bg-accent hover:text-white transition-all transform hover:scale-105 active:scale-95"
                            >
                                Contactar_Soporte
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
