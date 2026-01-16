import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { listCarsPaginated, CarData } from "../../services/car.service";
import ImageAdapter from "../ui/ImageAdapter";

interface RelatedCarsCarouselProps {
    ownerUsername: string;
    currentCarId?: number;
}

export default function RelatedCarsCarousel({ ownerUsername, currentCarId }: RelatedCarsCarouselProps) {
    const [cars, setCars] = useState<CarData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedCars = async () => {
            try {
                // Trae los autos del usuario
                // Limite de 10 para asegurar que haya autos para mostrar   
                const response = await listCarsPaginated(ownerUsername, {
                    page: 1,
                    limit: 10,
                    sortBy: 'id',
                    sortOrder: 'desc'
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

    if (isLoading || cars.length === 0) {
        return null;
    }

    return (
        <section className="w-full border-t border-white/5 bg-[#050505] py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-10">
                <div className="flex items-end justify-between mb-8 px-2">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                            Más de la colección
                        </h2>
                        <p className="text-white/40 text-sm">
                            Otros vehículos de <span className="text-accent font-bold">@{ownerUsername}</span>
                        </p>
                    </div>
                    <Link
                        to={`/collection/${ownerUsername}`}
                        className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-colors uppercase tracking-wider"
                    >
                        Ver todos <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Carousel Container */}
                <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 px-6 md:px-10 -mx-6 md:-mx-10 snap-x snap-mandatory">
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
