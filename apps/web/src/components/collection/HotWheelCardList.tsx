import { motion } from "framer-motion";
import type { HotWheelMock } from "../../data/mockHotWheels";

interface Props {
  car: HotWheelMock;
  onClick?: () => void;
}

export default function HotWheelCardList({ car, onClick }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-colors"
    >
      <img
        src={car.image}
        alt={car.name}
        className="w-16 h-16 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-sm truncate">{car.name}</h3>
        <p className="text-white/50 text-xs">{car.brand}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-white text-sm">{car.year}</p>
        {car.series && (
          <p className="text-accent text-xs truncate max-w-25">{car.series}</p>
        )}
      </div>
    </motion.div>
  );
}