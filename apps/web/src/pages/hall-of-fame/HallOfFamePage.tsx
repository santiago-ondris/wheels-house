import { motion } from "framer-motion";
import { Users, Code, Trophy, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const categories = [
    {
        title: "Fundadores",
        description: "Los primeros 100 usuarios que confiaron en la visión de Wheels House.",
        icon: Users,
        path: "/hall-of-fame/founders",
        accentColor: "rgba(59, 130, 246, 1)",
        glowColor: "rgba(59, 130, 246, 0.4)",
        iconColor: "text-blue-400"
    },
    {
        title: "Colaboradores",
        description: "Amigos que aportaron ideas y ayudaron a construir este hogar.",
        icon: Code,
        path: "/hall-of-fame/contributors",
        accentColor: "rgba(16, 185, 129, 1)",
        glowColor: "rgba(16, 185, 129, 0.4)",
        iconColor: "text-emerald-400"
    },
    {
        title: "Embajadores",
        description: "Personas que promueven Wheels House. Cada acción se valora.",
        icon: Trophy,
        path: "/hall-of-fame/ambassadors",
        accentColor: "rgba(168, 85, 247, 1)",
        glowColor: "rgba(168, 85, 247, 0.4)",
        iconColor: "text-purple-400"
    },
    {
        title: "Leyendas",
        description: "Figuras icónicas cuya colección y trayectoria trascienden el tiempo.",
        icon: Star,
        path: "/hall-of-fame/legends",
        accentColor: "rgba(245, 158, 11, 1)",
        glowColor: "rgba(245, 158, 11, 0.4)",
        iconColor: "text-amber-400"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function HallOfFamePage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-[80vh] py-12 px-6">
            <div className="container mx-auto max-w-8xl relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter italic">
                        Salón de la <span className="text-accent underline decoration-accent/30 underline-offset-8">Fama</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Dedicado a quienes hacen de Wheels House la mejor comunidad de coleccionistas.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {categories.map((category) => (
                        <motion.div key={category.title} variants={item}>
                            <Link
                                to={category.path}
                                className="group relative block h-full p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-2xl transition-all duration-500 hover:border-white/20 overflow-hidden shadow-2xl"
                            >
                                <div
                                    className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-[80px] opacity-20 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
                                    style={{ backgroundColor: category.glowColor }}
                                />
                                <div
                                    className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-[60px] opacity-10 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                                    style={{ backgroundColor: category.glowColor }}
                                />

                                {/* GLASS BORDER GLINT */}
                                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className={`p-4 bg-white/5 rounded-2xl w-fit mb-6 border border-white/10 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ${category.iconColor}`}>
                                        <category.icon size={32} />
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight italic uppercase">{category.title}</h3>
                                    <p className="text-white/50 mb-8 flex-grow leading-relaxed">
                                        {category.description}
                                    </p>

                                    <div className="flex items-center gap-3 text-white font-bold group-hover:gap-5 transition-all duration-500">
                                        <span className="text-sm tracking-widest uppercase opacity-70 group-hover:opacity-100">Entrar al salón</span>
                                        <div
                                            className="p-2 rounded-full transition-transform duration-500 group-hover:translate-x-2"
                                            style={{ backgroundColor: category.glowColor }}
                                        >
                                            <ArrowRight size={18} className="text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Subtle Watermark Icon */}
                                <category.icon
                                    size={140}
                                    className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none"
                                    style={{ color: category.accentColor }}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
