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
      onSelect?.();
    } else {
      onClick?.();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className={`group flex items-center gap-4 bg-[#0a0a0b] border-l-2 p-3 cursor-pointer transition-all ${isSelected
        ? 'border-l-accent bg-accent/5'
        : 'border-l-white/10 hover:border-l-accent/50 hover:bg-white/[0.02]'
        }`}
    >
      {/* Selection indicator */}
      {selectable && (
        <div
          className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all ${isSelected
            ? 'bg-accent border-accent text-white'
            : 'bg-transparent border-white/20 text-white/40'
            }`}
        >
          {isSelected && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      )}

      {/* Image */}
      <div className="relative w-16 h-16 shrink-0 overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 border border-white/10" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white text-sm font-mono font-bold uppercase tracking-tight truncate">
          {car.name}
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5">
          <span className="text-accent uppercase tracking-wider">{car.brand}</span>
          {car.manufacturer && (
            <>
              <span className="text-white/20">//</span>
              <span className="text-white/40 uppercase tracking-wider truncate">{car.manufacturer}</span>
            </>
          )}
        </div>
      </div>

      {/* Right section - data indicators */}
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        {car.series && (
          <div className="text-right">
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">Serie</p>
            <p className="text-[11px] font-mono text-white/60 uppercase">{car.series}</p>
          </div>
        )}

        {/* Decorator */}
        <div className="flex gap-0.5">
          <div className="w-0.5 h-4 bg-white/10 group-hover:bg-accent/30 transition-colors" />
          <div className="w-0.5 h-4 bg-white/5" />
        </div>
      </div>
    </motion.div>
  );
}
