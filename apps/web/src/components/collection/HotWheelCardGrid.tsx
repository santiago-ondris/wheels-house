import { motion } from "framer-motion";
import type { HotWheelMock } from "../../data/mockHotWheels";

interface Props {
  car: HotWheelMock;
}

export default function HotWheelCardGrid({ car }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
    >
      <div className="aspect-4/3">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-white font-bold text-sm truncate">{car.name}</h3>
        <p className="text-white/50 text-xs">{car.brand}</p>
      </div>
    </motion.div>
  );
}