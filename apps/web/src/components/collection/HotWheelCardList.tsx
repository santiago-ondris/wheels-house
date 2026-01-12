import { motion } from "framer-motion";
import type { HotWheelMock } from "../../data/mockHotWheels";

interface Props {
  car: HotWheelMock;
  onClick?: () => void;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function HotWheelCardList({ car, onClick, selectable, isSelected, onSelect }: Props) {
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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className={`flex items-center gap-4 bg-white/5 backdrop-blur-md border rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all ${isSelected ? 'border-accent ring-2 ring-accent/30' : 'border-white/10'
        }`}
    >
      {/* Selection indicator */}
      {selectable && (
        <div
          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 transition-all pointer-events-none ${isSelected
              ? 'bg-accent text-white'
              : 'bg-white/10 text-white/50'
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

