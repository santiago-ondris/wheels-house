import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import ImageAdapter from "../ui/ImageAdapter";
import { getCuratedCarForCurrentMonth } from "../../data/curatedCars";
import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../auth/LoginModal";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function FeaturedCar() {
    const { user, isAuthenticated } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const featuredCar = getCuratedCarForCurrentMonth();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // pictures[0] = PC, pictures[1] = Celu
    const carImage = isMobile && featuredCar.pictures && featuredCar.pictures.length > 1
        ? featuredCar.pictures[1]
        : (featuredCar.pictures?.[0] || "https://placehold.co/1200x800/1A1B4B/D9731A?text=No+Image");

    const collectionLink = isAuthenticated && user?.username
        ? `/collection/${user.username}`
        : "/collection";

    const handleCollectionClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            setIsLoginOpen(true);
        }
    };

    return (
        <section className="container mx-auto px-6 py-10 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-[150px] -z-10 rounded-full opacity-30" />

            <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between mb-8"
            >
                <div>
                    <h2 className="text-4xl md:text-6xl font-black text-accent tracking-tighter">
                        Elegido
                        <br />
                        del mes
                    </h2>
                </div>

                <div className="flex-1 hidden lg:flex items-center justify-center overflow-hidden pointer-events-none">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="text-[4rem] lg:text-[5rem] xl:text-[8rem] 2xl:text-[10rem] font-black tracking-tighter text-white whitespace-nowrap select-none opacity-50 lg:opacity-100"
                    >
                        COLLECTION
                    </motion.span>
                </div>

                <div className="flex flex-col items-end pt-4">
                    <span className="text-accent uppercase tracking-[0.3em] text-sm font-black mb-2">
                        02 / Featured
                    </span>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden lg:flex lg:min-h-[500px] 2xl:min-h-[600px] hover:border-accent/40 transition-all duration-700 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
            >
                <div className="lg:w-[55%] relative overflow-hidden">
                    <ImageAdapter
                        fit="smart"
                        src={carImage}
                        alt={featuredCar.name}
                        className="w-full h-[420px] lg:h-full"
                    />
                </div>

                <div className="lg:w-[45%] p-8 lg:p-10 2xl:p-16 flex flex-col justify-between relative z-10 bg-linear-to-br from-white/[0.02] to-transparent">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="px-4 py-1.5 bg-accent/20 text-accent text-xs font-black uppercase tracking-widest rounded-full border border-accent/20 shadow-lg shadow-accent/5">
                                {featuredCar.series || "Hot Wheels Premium"}
                            </span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <h3 className="text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-6 2xl:mb-10 group-hover:text-accent transition-colors duration-500">
                            {featuredCar.name}
                        </h3>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                            <div className="space-y-2">
                                <span className="text-white/20 text-xs uppercase font-black tracking-widest block">Marca</span>
                                <p className="text-white text-xl lg:text-2xl 2xl:text-3xl font-bold tracking-tight">{featuredCar.brand}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-white/20 text-xs uppercase font-black tracking-widest block">Fabricante</span>
                                <p className="text-white text-xl lg:text-2xl 2xl:text-3xl font-bold tracking-tight">{featuredCar.manufacturer}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-white/20 text-xs uppercase font-black tracking-widest block">Color Principal</span>
                                <p className="text-white text-xl lg:text-2xl 2xl:text-3xl font-bold tracking-tight">{featuredCar.color}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-white/20 text-xs uppercase font-black tracking-widest block">Escala</span>
                                <p className="text-white text-xl lg:text-2xl 2xl:text-3xl font-bold tracking-tight">{featuredCar.scale}</p>
                            </div>
                        </div>

                        {featuredCar.description && (
                            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 italic text-white/60 text-lg leading-relaxed">
                                "{featuredCar.description}"
                            </div>
                        )}
                    </div>

                    <div className="mt-12 lg:mt-auto pt-10 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent to-accent/60 flex items-center justify-center border border-white/20 shadow-xl shadow-accent/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <span className="text-white text-xl font-black">@</span>
                            </div>
                            <div>
                                <span className="text-white/30 text-xs block font-black uppercase tracking-widest">Propietario</span>
                                <p className="text-white text-xl font-black tracking-tight">@{featuredCar.ownerUsername}</p>
                            </div>
                        </div>

                        <Link
                            to={collectionLink}
                            onClick={handleCollectionClick}
                            className="group/btn flex items-center gap-2 lg:gap-3 text-white transition-all hover:gap-4 hover:text-accent"
                        >
                            <span className="font-black text-sm lg:text-base tracking-widest uppercase border-b-2 border-transparent group-hover/btn:border-accent transition-all pb-1">
                                Ir a mi colección
                            </span>
                            <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </motion.div>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </section>
    );
}
