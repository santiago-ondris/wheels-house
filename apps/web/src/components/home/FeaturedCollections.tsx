import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Car, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getFounders, Founder } from "../../services/profile.service";

const TOTAL_FOUNDERS_LIMIT = 100;

export default function FeaturedCollections() {
    const [featuredUsers, setFeaturedUsers] = useState<Founder[]>([]);
    const [totalFounders, setTotalFounders] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const founders = await getFounders();
                setFeaturedUsers(founders.slice(0, 2));
                setTotalFounders(founders.length);
            } catch (error) {
                console.error("Error fetching featured users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const totalSlides = featuredUsers.length + 1;
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

    const handleSwipe = (direction: number) => {
        if (direction > 0) prevSlide();
        else nextSlide();
    };

    if (isLoading) {
        return (
            <section className="container mx-auto px-6 py-10">
                <div className="animate-pulse">
                    <div className="h-6 w-48 bg-white/5 rounded mb-8" />
                    <div className="grid md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-56 bg-white/5 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const userCards = featuredUsers.map((user) => ({
        type: "user" as const,
        data: user,
    }));

    const foundersCard = {
        type: "founders" as const,
        progress: totalFounders,
    };

    const allCards = [...userCards, foundersCard];

    return (
        <section className="container mx-auto px-6 py-10">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <span className="text-accent uppercase tracking-widest text-xs font-bold">
                        Descubrí Colecciones
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
                        Mirá lo que otros arman
                    </h2>
                </div>
                <span className="text-white/30 text-xs hidden md:block">
                    ¡Y sé parte del inicio!
                </span>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-5">
                {userCards.map((card) => (
                    <UserCard key={card.data.userId} user={card.data} />
                ))}
                <FoundersCtaCard progress={foundersCard.progress} />
            </div>

            {/* Mobile Slider */}
            <div className="md:hidden relative">
                <div className="overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.2 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (Math.abs(info.offset.x) > 50) {
                                    handleSwipe(info.offset.x);
                                }
                            }}
                        >
                            {allCards[currentSlide].type === "user" ? (
                                <UserCard
                                    user={(allCards[currentSlide] as { type: "user"; data: Founder }).data}
                                />
                            ) : (
                                <FoundersCtaCard progress={totalFounders} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 p-2 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full transition-colors z-10 border border-white/10"
                >
                    <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 p-2 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full transition-colors z-10 border border-white/10"
                >
                    <ChevronRight className="w-4 h-4 text-white" />
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-4">
                    {allCards.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${currentSlide === index
                                ? "bg-accent w-6"
                                : "bg-white/20 hover:bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// User Collection Card - Premium Design
function UserCard({ user }: { user: Founder }) {
    return (
        <Link
            to={`/collection/${user.username}`}
            className="group relative block overflow-hidden rounded-2xl border border-white/10 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,107,0,0.15)]"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 group-hover:opacity-40 transition-opacity"
                style={{ backgroundImage: 'url(/bgfeaturedcolector.svg)' }}
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative p-6">
                {/* Badge */}
                <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider rounded-full border border-accent/30">
                        Fundador #{user.founderNumber.toString().padStart(3, '0')}
                    </span>
                </div>

                {/* Avatar with glow */}
                <div className="relative w-20 h-20 mb-4 mx-auto">
                    <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full group-hover:bg-accent/50 transition-colors" />
                    {user.picture ? (
                        <img
                            src={user.picture}
                            alt={user.username}
                            className="relative w-full h-full rounded-full object-cover border-2 border-white/20 group-hover:border-accent/60 transition-colors"
                        />
                    ) : (
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent to-accent/50 border-2 border-white/20 group-hover:border-accent/60 flex items-center justify-center text-white font-bold text-2xl transition-colors">
                            {user.firstName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* User Info */}
                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors text-center">
                    @{user.username}
                </h3>
                <p className="text-white/40 text-sm mt-1 text-center">
                    {user.firstName} {user.lastName}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <Car className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">{user.carCount}</p>
                            <p className="text-white/30 text-[10px] uppercase tracking-wider">Autos</p>
                        </div>
                    </div>

                    <div className="ml-auto">
                        <span className="flex items-center gap-1 text-accent text-sm font-medium group-hover:gap-2 transition-all">
                            Ver colección
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Founders Call-to-Action Card - Urgency Design
function FoundersCtaCard({ progress }: { progress: number }) {
    const remaining = TOTAL_FOUNDERS_LIMIT - progress;
    const progressPercent = Math.min((progress / TOTAL_FOUNDERS_LIMIT) * 100, 100);
    const isUrgent = remaining <= 20;

    return (
        <Link
            to="/hall-of-fame/founders"
            className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/20 via-sky-600/10 to-sky-700/5 border border-sky-400/30 hover:border-sky-400/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(56,189,248,0.2)]"
        >
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Sparkle decoration */}
            <div className="absolute top-4 right-4">
                <Sparkles className="w-6 h-6 text-sky-400/50 group-hover:text-sky-400 transition-colors" />
            </div>

            <div className="relative p-6">
                {/* Icon */}
                <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 bg-sky-400/30 blur-xl rounded-full" />
                    <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-sky-400/30 to-sky-600/20 border border-sky-400/30 flex items-center justify-center">
                        <Users className="w-8 h-8 text-sky-400" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white">
                    Salón de Fundadores
                </h3>
                <p className="text-sky-400 text-sm font-medium mt-1">
                    ¡Aún podés ser parte!
                </p>

                {/* Progress Section */}
                <div className="mt-5 pt-4 border-t border-sky-400/10">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/40">Ocupación</span>
                        <span className="text-sky-400 font-mono font-bold">
                            {progress}/{TOTAL_FOUNDERS_LIMIT}
                        </span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    {/* Urgency message */}
                    <p className={`text-sm mt-3 font-medium ${isUrgent ? 'text-amber-400' : 'text-white/50'}`}>
                        {remaining > 0
                            ? `${remaining} lugares restantes`
                            : "¡Salón completo!"}
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-4">
                    <span className="flex items-center gap-1 text-sky-400 text-sm font-medium group-hover:gap-2 transition-all">
                        Ver fundadores
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
