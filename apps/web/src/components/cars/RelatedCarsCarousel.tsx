import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { listCarsPaginated, CarData } from "../../services/car.service";
import { getPublicProfile } from "../../services/profile.service";
import ImageAdapter from "../ui/ImageAdapter";

interface RelatedCarsCarouselProps {
    ownerUsername: string;
    currentCarId?: number;
}

export default function RelatedCarsCarousel({ ownerUsername, currentCarId }: RelatedCarsCarouselProps) {
    const [cars, setCars] = useState<CarData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true); // Assume true initially if content loads

    useEffect(() => {
        const fetchRelatedCars = async () => {
            try {
                // Determine sort preference
                let sortBy: any = 'id';
                let sortOrder: any = 'desc';

                try {
                    const profile = await getPublicProfile(ownerUsername);
                    if (profile.defaultSortPreference) {
                        const [field, order] = profile.defaultSortPreference.split(':');
                        if (field) sortBy = field;
                        if (order) sortOrder = order;
                    }
                } catch (err) {
                    console.warn("Could not fetch profile preferences, using default sort.");
                }

                // Trae los autos del usuario
                // Limite de 10 para asegurar que haya autos para mostrar   
                const response = await listCarsPaginated(ownerUsername, {
                    page: 1,
                    limit: 10,
                    sortBy,
                    sortOrder
                });

                // Filtra el auto actual
                const filteredCars = response.items.filter(
                    (car) => car.carId !== currentCarId
                );

                setCars(filteredCars);
            } catch (error) {
                console.error("Error fetching related cars:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (ownerUsername) {
            fetchRelatedCars();
        }
    }, [ownerUsername, currentCarId]);

    const checkScroll = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            // Allow a small buffer (1px) for float calculation errors
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            // Check initially and after content loads/resize
            checkScroll();
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (container) container.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [cars, checkScroll]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.75; // Scroll 75% of view width
            const targetScroll = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading || cars.length === 0) {
        return null;
    }

    return (
        <section className="w-full border-t border-white/5 bg-[#050505] py-16 group/section">
            <div className="max-w-7xl mx-auto px-4 md:px-10 relative">
                <div className="flex items-end justify-between mb-8 px-2">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                            Más de la colección
                        </h2>
                        <p className="text-white/40 text-sm">
                            <span className="text-accent font-bold">@{ownerUsername}</span>
                        </p>
                    </div>
                    <Link
                        to={`/collection/${ownerUsername}`}
                        className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors uppercase tracking-wider"
                    >
                        Ver todos <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Navigation Buttons - Desktop Only */}
                <button
                    onClick={() => scroll('left')}
                    className={`hidden md:flex absolute -left-4 top-1/2 mt-8 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 text-white items-center justify-center rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 active:scale-95 hover:bg-black hover:border-white/20 shadow-2xl shadow-black/50 ${!canScrollLeft ? "opacity-0 pointer-events-none translate-x-2" : ""}`}
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={() => scroll('right')}
                    className={`hidden md:flex absolute -right-4 top-1/2 mt-8 -translate-y-1/2 z-20 w-12 h-12 bg-black/80 text-white items-center justify-center rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 active:scale-95 hover:bg-black hover:border-white/20 shadow-2xl shadow-black/50 ${!canScrollRight ? "opacity-0 pointer-events-none -translate-x-2" : ""}`}
                    aria-label="Scroll right"
                    disabled={!canScrollRight}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Carousel Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 md:gap-6 pb-6 px-2 md:px-1 md:-mx-1 snap-x snap-mandatory scrollbar-hide md:[scrollbar-width:none]"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {cars.map((car) => (
                        <Link
                            key={car.carId}
                            to={`/car/${car.carId}`}
                            className="snap-start shrink-0 w-[45%] sm:w-[200px] md:w-[240px] group"
                        >
                            <div className="aspect-[4/3] bg-white/5 rounded-2xl overflow-hidden border border-white/10 group-hover:border-accent/50 transition-colors relative mb-3">
                                {car.pictures && car.pictures.length > 0 ? (
                                    <ImageAdapter
                                        src={car.pictures[0]}
                                        alt={car.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-4 bg-white/5 group-hover:scale-105 transition-transform duration-500">
                                        <p className="text-white/20 text-[10px] md:text-xs text-center font-bold italic leading-relaxed">
                                            "Mmm, parece que faltan cargar imagenes en este auto todavia"
                                        </p>
                                    </div>
                                )}
                                {car.wished && (
                                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500/90 text-black text-[10px] font-bold uppercase rounded-full">
                                        Wished
                                    </div>
                                )}
                            </div>
                            <h3 className="text-white font-bold text-sm md:text-base truncate group-hover:text-accent transition-colors">
                                {car.name}
                            </h3>
                            <p className="text-white/40 text-xs uppercase tracking-wider truncate">
                                {car.brand}
                            </p>
                        </Link>
                    ))}

                    {/* Spacer for right padding in scrolling container */}
                    <div className="w-1 shrink-0" />
                </div>
            </div>
        </section>
    );
}
