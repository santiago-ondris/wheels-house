import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Car } from "lucide-react";
import SearchInput from "../collection/SearchInput";
import ViewSwitcher from "../collection/ViewSwitcher";
import HotWheelCardGrid from "../collection/HotWheelCardGrid";
import HotWheelCardList from "../collection/HotWheelCardList";
import { CarData } from "../../services/car.service";

interface CollectionSectionProps {
    cars: CarData[];
    isOwner: boolean;
}

export default function CollectionSection({ cars, isOwner }: CollectionSectionProps) {
    const navigate = useNavigate();
    const [view, setView] = useState<"grid" | "list">("grid");

    const mappedCars = cars.map((car) => ({
        id: String(car.carId),
        name: car.name,
        brand: car.brand,
        year: 0,
        series: car.series || undefined,
        image: car.pictures && car.pictures.length > 0
            ? car.pictures[0]
            : "https://placehold.co/400x300/1A1B4B/D9731A?text=No+Image"
    }));

    const handleAddCar = () => {
        navigate("/collection/add");
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-accent" />
                    Toda mi Colección
                    <span className="text-accent/70 text-sm font-normal ml-2">
                        ({cars.length})
                    </span>
                </h2>
                {isOwner && cars.length > 0 && (
                    <button
                        onClick={handleAddCar}
                        className="p-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline text-xs uppercase tracking-widest font-bold">
                            Nuevo
                        </span>
                    </button>
                )}
            </div>

            {cars.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                    <Car className="w-16 h-16 mx-auto mb-4 text-white/20" />
                    <p className="text-white/60 text-lg mb-2">
                        {isOwner ? "Tu colección está vacía" : "Esta colección está vacía"}
                    </p>
                    {isOwner && (
                        <button
                            onClick={handleAddCar}
                            className="mt-4 px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg transition-all flex items-center gap-2 mx-auto"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar tu primer auto
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <SearchInput />
                        </div>
                        <ViewSwitcher view={view} onViewChange={setView} />
                    </div>

                    {/* Cars grid/list */}
                    <AnimatePresence mode="wait">
                        {view === "grid" ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                            >
                                {mappedCars.map((car) => (
                                    <HotWheelCardGrid
                                        key={car.id}
                                        car={car}
                                        onClick={() => navigate(`/car/${car.id}`)}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col gap-3"
                            >
                                {mappedCars.map((car) => (
                                    <HotWheelCardList
                                        key={car.id}
                                        car={car}
                                        onClick={() => navigate(`/car/${car.id}`)}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </motion.section>
    );
}
