import { motion } from "framer-motion";
import { Compass, Mail, ArrowRight, Layers, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

export default function BetaInfoSection() {
    return (
        <section className="container mx-auto px-6 py-10 mb-20 relative">
            {/* Technical visual separators */}
            <div className="absolute top-0 left-10 w-px h-full bg-linear-to-b from-white/5 via-transparent to-white/5 hidden lg:block" />
            <div className="absolute top-0 right-10 w-px h-full bg-linear-to-b from-white/5 via-transparent to-white/5 hidden lg:block" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
                {/* Roadmap Card - Blueprint Style */}
                <motion.div
                    {...fadeInUp}
                    className="group"
                >
                    <Link
                        to="/roadmap"
                        className="blueprint-card flex flex-col h-full p-8 lg:p-12 rounded-lg border-dashed"
                    >
                        {/* Blueprint Stamp */}
                        <div className="blueprint-stamp">
                            RELEASE // V0.8.2
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blueprint/10 rounded border border-blueprint/20">
                                <Terminal className="w-4 h-4 text-blueprint" />
                            </div>
                            <span className="font-mono text-xs text-blueprint tracking-widest uppercase opacity-60">
                                Nuestras ideas // Fase de planificación
                            </span>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">
                                Road<span className="text-blueprint">map</span>
                            </h3>
                            <p className="text-white/50 text-base lg:text-lg font-mono leading-relaxed max-w-sm">
                                Entrá aca para ver las ideas que tenemos pensadas para añadir a Wheels House.
                            </p>
                        </div>

                        <div className="mt-auto space-y-6">
                            <div className="h-px bg-white/5 w-full" />
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-3 text-blueprint font-mono text-sm font-bold uppercase tracking-wider group-hover:gap-5 transition-all">
                                    Ver Ideas
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                                <Layers className="w-10 h-10 text-white/5 group-hover:text-blueprint/10 transition-colors" />
                            </div>
                        </div>

                        {/* Top-left corner technical marks */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blueprint/40" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blueprint/40" />
                    </Link>
                </motion.div>

                {/* Contact Card - Blueprint Style */}
                <motion.div
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: 0.2 }}
                    className="group"
                >
                    <Link
                        to="/contact"
                        className="blueprint-card flex flex-col h-full p-8 lg:p-12 rounded-lg border-dashed"
                    >
                        {/* Blueprint Stamp */}
                        <div className="blueprint-stamp -rotate-6">
                            URGENT // FEEDBACK
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blueprint/10 rounded border border-blueprint/20">
                                <Mail className="w-4 h-4 text-blueprint" />
                            </div>
                            <span className="font-mono text-xs text-blueprint tracking-widest uppercase opacity-60">
                                Comunicación // Te escuchamos
                            </span>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">
                                Con<span className="text-blueprint">tacto</span>
                            </h3>
                            <p className="text-white/50 text-base lg:text-lg font-mono leading-relaxed max-w-sm">
                                Cualquier idea, error, necesidad o duda, te queremos escuchar para mejorar la plataforma.
                            </p>
                        </div>

                        <div className="mt-auto space-y-6">
                            <div className="h-px bg-white/5 w-full" />
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-3 text-blueprint font-mono text-sm font-bold uppercase tracking-wider group-hover:gap-5 transition-all">
                                    Contactanos
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                                <Compass className="w-10 h-10 text-white/5 group-hover:text-blueprint/10 transition-colors" />
                            </div>
                        </div>

                        {/* Top-left corner technical marks */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blueprint/40" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blueprint/40" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
