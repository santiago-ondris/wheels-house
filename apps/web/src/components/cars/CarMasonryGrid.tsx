import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface CarMasonryGridProps {
  images: string[];
}

export const CarMasonryGrid = ({ images }: CarMasonryGridProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  }, [selectedIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);

  // soporte para el teclado 
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  return (
    <>
      <div className="w-full px-2 md:px-6 mb-10">
        <div className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
          {images.map((src, index) => (
            <motion.div
              key={`${src}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative break-inside-avoid rounded-xl overflow-hidden bg-white/5 border border-white/10 group cursor-zoom-in"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={src}
                alt={`Gallery item ${index}`}
                className="w-full h-auto block transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="text-white drop-shadow-lg" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4 md:p-8"
            onClick={() => setSelectedIndex(null)}
          >

            <button
              className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all z-50 backdrop-blur-sm"
              onClick={() => setSelectedIndex(null)}
            >
              <X size={28} />
            </button>

            <button
              className="absolute left-4 md:left-8 p-3 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all hidden md:flex z-50"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            >
              <ChevronLeft size={40} />
            </button>

            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}

                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_e, { offset }) => {
                  const swipeThreshold = 50;
                  if (offset.x > swipeThreshold) handlePrev();
                  else if (offset.x < -swipeThreshold) handleNext();
                }}

                src={images[selectedIndex]}
                alt="Full view"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing select-none"
              />
            </div>

            <button
              className="absolute right-4 md:right-8 p-3 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all hidden md:flex z-50"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
            >
              <ChevronRight size={40} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white/90 text-xs tracking-widest font-mono border border-white/5">
              {selectedIndex + 1} / {images.length}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};