import { motion } from "framer-motion";
import type { HotWheelMock } from "../../data/mockHotWheels";

interface Props {
  car: HotWheelMock;
  onClick?: () => void;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function HotWheelCardGrid({ car, onClick, selectable, isSelected, onSelect }: Props) {
  const handleCardClick = () => {
    if (selectable) {
      // In selection mode, clicking anywhere selects
      onSelect?.();
    } else {
      // Normal mode, navigate to detail
      onClick?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className={`relative bg-white/5 backdrop-blur-md border rounded-xl overflow-hidden cursor-pointer hover:bg-white/10 transition-all ${isSelected ? 'border-accent ring-2 ring-accent/30' : 'border-white/10'
        }`}
    >
      {/* Selection indicator */}
      {selectable && (
        <div
          className={`absolute top-2 left-2 z-10 w-6 h-6 rounded flex items-center justify-center transition-all pointer-events-none ${isSelected
              ? 'bg-accent text-white'
              : 'bg-black/50 text-white/50'
            }`}
        >
          {isSelected ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <div className="w-3 h-3 border border-current rounded-sm" />
          )}
        </div>
      )}

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

