import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import SearchInput from "../components/collection/SearchInput";
import ViewSwitcher from "../components/collection/ViewSwitcher";
import HotWheelCardGrid from "../components/collection/HotWheelCardGrid";
import HotWheelCardList from "../components/collection/HotWheelCardList";
import EmptyCollection from "../components/collection/EmptyCollection";
import { listCars, CarData } from "../services/car.service";
import { useAuth } from "../contexts/AuthContext";

export default function CollectionPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [cars, setCars] = useState<CarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchCars = async () => {
    if (!user?.username) return;
    setIsLoading(true);
    try {
      const data = await listCars(user.username);
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [user?.username]);

  const handleAddCar = () => {
    navigate("/collection/add");
  };

  const mappedCars = cars.map((car, index) => ({
    id: index.toString(),
    name: car.name,
    brand: car.brand,
    year: 0,
    series: car.series || undefined,
    image: car.picture || "https://placehold.co/400x300/1A1B4B/D9731A?text=No+Image"
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Mi Colección</h1>
          <div className="flex items-center gap-4">
            <span className="text-accent uppercase tracking-widest text-[10px] md:text-xs">
              {cars.length} {cars.length === 1 ? 'item' : 'items'}
            </span>
            {cars.length > 0 && (
              <button
                onClick={handleAddCar}
                className="p-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline text-xs uppercase tracking-widest font-bold">Nuevo</span>
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-4/3 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <EmptyCollection onAddCar={handleAddCar} />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <SearchInput />
              </div>
              <ViewSwitcher view={view} onViewChange={setView} />
            </div>

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
                    <HotWheelCardGrid key={car.id} car={car} />
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
                    <HotWheelCardList key={car.id} car={car} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  );
}
