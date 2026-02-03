import { motion } from "framer-motion";
import {
    Flag,
    Rocket,
    ShieldCheck,
    Users,
    Target,
    LayoutGrid,
    ArrowRight
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function EarlyAccessPage() {
    const { user } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const foundingMembersCount = 6;
    const totalFoundingMembers = 100;
    const progressPercentage = (foundingMembersCount / totalFoundingMembers) * 100;

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white py-12 px-4 relative overflow-hidden">
            {/* Grid Pattern Background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, white 1px, transparent 1px),
                        linear-gradient(to bottom, white 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Ambient Light Blobs - Optimized for performance */}
            <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="hidden md:block absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="text-center space-y-4 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 border border-accent/10 rounded-full"
                    >
                        <Flag className="w-3 h-3 text-accent" />
                        <span className="text-[14px] font-mono font-black uppercase tracking-[0.2em] text-accent">
                            EARLY_ACCESS
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-mono font-black uppercase tracking-tighter"
                    >
                        ¿Por qué <span className="text-accent">hacemos</span> esto?
                    </motion.h1>
                </header>

                {/* Content Section */}
                <div className="space-y-12 font-mono">
                    {/* El Problema */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-black uppercase tracking-tight text-accent flex items-center gap-3">
                            <Target className="w-5 h-5" />
                            El problema
                        </h2>
                        <div className="text-white/70 leading-relaxed space-y-4 text-sm md:text-base">
                            <p>
                                Somos coleccionistas. Supimos usar Excel, fotos en el celular, alguna que otra app
                                para trackear nuestras colecciones. Y funcionaba... más o menos.
                            </p>
                            <p>
                                Igual siempre nos faltó algo: <strong className="text-white font-black italic">un lugar para compartir.</strong>
                            </p>
                            <p>
                                Mostrarle a un amigo lo que encontramos, ver lo que otras personas coleccionan,
                                conectar con alguien que capaz vio lo que estabas buscando, o simplemente de chusma
                                ver qué onda la colección de otro.
                            </p>
                            <p>
                                La comunidad estaba dispersa: grupos de Facebook, chats de WhatsApp,
                                encuentros casuales, cuentas de Instagram, hasta Reddit mismo.
                            </p>
                        </div>
                    </motion.section>

                    {/* Nuestra Solución */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-black uppercase tracking-tight text-accent flex items-center gap-3">
                            <Rocket className="w-5 h-5" />
                            Nuestra solución
                        </h2>
                        <p className="text-white/70 leading-relaxed text-sm md:text-base">
                            Wheels House nació para ser ese lugar. Organizar la colección, conectar con otros
                            coleccionistas, y disfrutar de juegos diarios como WheelWord, como agregado.
                        </p>
                    </motion.section>

                    {/* Sobre ser sustentables */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-black uppercase tracking-tight text-accent flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5" />
                            Sobre ser sustentables
                        </h2>
                        <div className="text-white/70 leading-relaxed space-y-4 text-sm md:text-base">
                            <p>
                                Pero para que Wheels House crezca y mejore, necesita ser sustentable económicamente.
                                Servidores, almacenamiento, y (eventualmente) nuestro tiempo completo
                                tienen un costo.
                            </p>
                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                                <p>Por eso, <strong className="text-white font-black uppercase tracking-tighter">Wheels House será de pago en el futuro:</strong></p>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                        <span>Plan gratuito con funciones básicas</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                        <span>Plan premium: ARS 2,500/mes (para usuarios de ARG) o USD 3/mes (internacional)</span>
                                    </li>
                                </ul>
                            </div>
                            <p className="text-xs text-white/40 italic">
                                La transparencia es clave para nosotros, por eso preferimos ser honestos desde el
                                día 1 en lugar de sorprender a nadie después.
                            </p>
                        </div>
                    </motion.section>

                    {/* Para los primeros 100 */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6 pt-6 border-t border-white/5"
                    >
                        <h2 className="text-xl font-black uppercase tracking-tight text-accent flex items-center gap-3">
                            <Users className="w-5 h-5" />
                            Para los primeros 100
                        </h2>
                        <div className="text-white/70 leading-relaxed space-y-6 text-sm md:text-base">
                            <p>
                                Si estás leyendo esto como Miembro Fundador, tu acceso es <strong className="text-accent font-black uppercase tracking-tighter">gratis para siempre</strong>. Como agradecimiento por confiar
                                en nosotros cuando éramos solo una idea.
                            </p>

                            <div className="space-y-4">
                                <p className="text-sm font-black uppercase tracking-widest text-white/60">Usuarios actuales: {foundingMembersCount}/{totalFoundingMembers}</p>

                                <div className="space-y-2">
                                    <div className="h-4 bg-white/5 border border-white/10 rounded-full overflow-hidden p-0.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${progressPercentage}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-accent rounded-full shadow-[0_0_15px_rgba(var(--color-accent),0.3)]"
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-white/30">
                                        <span>[████░░░░░░░░░░░░░░]</span>
                                        <span>{foundingMembersCount}/{totalFoundingMembers} Founding Members</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xl font-black text-white pt-4 text-center">
                                Gracias por estar acá.
                            </p>
                        </div>
                    </motion.section>
                </div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to="/community"
                        className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-white font-black font-mono text-sm uppercase -skew-x-12 hover:bg-white/10 hover:scale-105 transition-all group"
                    >
                        <span className="skew-x-12 flex items-center gap-2">
                            <Users className="w-4 h-4 text-accent" />
                            Comunidad
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>

                    {user?.username && (
                        <Link
                            to={`/collection/${user.username}`}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 bg-accent text-dark font-black font-mono text-sm uppercase -skew-x-12 hover:scale-105 transition-all group"
                        >
                            <span className="skew-x-12 flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4" />
                                Mi Colección
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
