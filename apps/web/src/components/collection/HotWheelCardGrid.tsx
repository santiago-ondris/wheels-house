import { motion } from "framer-motion";
import { HotWheelMock } from "../../data/mockHotWheels";
import { LikeButton } from "../../features/social/components/likes/LikeButton";

interface ExtendedHotWheel extends HotWheelMock {
  likesCount?: number;
  isLiked?: boolean;
}

interface Props {
  car: ExtendedHotWheel;
  onClick?: () => void;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}


export default function HotWheelCardGrid({ car, onClick, selectable, isSelected, onSelect }: Props) {
  const handleCardClick = () => {
    if (selectable) {
      onSelect?.();
    } else {
      onClick?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className={`group relative bg-[#0a0a0b] border-l-2 overflow-hidden cursor-pointer transition-all ${isSelected
        ? 'border-l-accent ring-1 ring-accent/30 bg-accent/5'
        : 'border-l-white/10 hover:border-l-accent/50 hover:bg-white/[0.02]'
        }`}
    >
      {/* Selection indicator */}
      {selectable && (
        <div
          className={`absolute top-2 left-2 z-10 w-5 h-5 border flex items-center justify-center transition-all ${isSelected
            ? 'bg-accent border-accent text-white'
            : 'bg-black/60 border-white/20 text-white/40'
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
      <div className="aspect-4/3 relative overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60" />
      </div>

      {/* Info panel */}
      <div className="p-3 space-y-1.5 border-t border-white/5 relative">
        {/* Like Button overlay (small) */}
        {!selectable && (
          <div className="absolute top-2 right-2 z-10">
            <LikeButton
              id={Number(car.id)}
              initialIsLiked={car.isLiked || false}
              initialLikesCount={car.likesCount || 0}
              type="car"
              showCount={true}
              className="scale-75 origin-top-right"
            />
          </div>
        )}

        {/* Name */}
        <h3 className="text-white text-sm font-mono font-bold uppercase tracking-tight truncate pr-12">
          {car.name}
        </h3>


        {/* Tech labels row */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-accent uppercase tracking-wider">{car.brand}</span>
          {car.manufacturer && (
            <>
              <span className="text-white/20">//</span>
              <span className="text-white/40 uppercase tracking-wider truncate">{car.manufacturer}</span>
            </>
          )}
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-accent/30 transition-colors" />
    </motion.div>
  );
}
