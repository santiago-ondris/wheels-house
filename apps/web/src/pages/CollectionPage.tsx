import { useState } from "react";
import { motion } from "framer-motion";
import SearchInput from "../components/collection/SearchInput";
import ViewSwitcher from "../components/collection/ViewSwitcher";
import HotWheelCardGrid from "../components/collection/HotWheelCardGrid";
import HotWheelCardList from "../components/collection/HotWheelCardList";
import { mockHotWheels } from "../data/mockHotWheels";

export default function CollectionPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Mi Colección</h1>
          <span className="text-accent uppercase tracking-widest text-xs">
            {mockHotWheels.length} items
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchInput />
          </div>
          <ViewSwitcher view={view} onViewChange={setView} />
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockHotWheels.map((car) => (
              <HotWheelCardGrid key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mockHotWheels.map((car) => (
              <HotWheelCardList key={car.id} car={car} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}