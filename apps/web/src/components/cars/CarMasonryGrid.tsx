import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight, ZoomOut, RefreshCw } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface CarMasonryGridProps {
  images: string[];
}

export const CarMasonryGrid = ({ images }: CarMasonryGridProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPinching, setIsPinching] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const lastTapTime = useRef<number>(0);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
    setIsZoomed(false);
    setIsPinching(false);
  }, [selectedIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
    setIsZoomed(false);
    setIsPinching(false);
  }, [selectedIndex, images.length]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      setSelectedIndex(null);
    }
  }, []);


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

      <AnimatePresence mode="wait">
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 md:p-8" // Increased darkness and removed padding on mobile for immersive feel
            onClick={handleBackdropClick} 
          >

            <button
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-black/20 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all z-50 backdrop-blur-sm"
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
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
            >
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit={true}
                doubleClick={{ disabled: true }} 
                onTransformed={(ref) => {
                  setIsZoomed(ref.state.scale > 1);
                }}
                onPinchingStart={() => setIsPinching(true)}
                onPinchingStop={() => setIsPinching(false)}
                key={selectedIndex}
              >
                {({ zoomIn, zoomOut, resetTransform, instance }) => (
                  <>
                    <div className="absolute top-6 left-6 flex flex-col gap-2 z-50 pointer-events-auto">
                      <button
                        onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                        title="Acercar"
                      >
                        <ZoomIn size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                        title="Alejar"
                      >
                        <ZoomOut size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); resetTransform(); }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md border border-white/10 active:scale-90 transition-all"
                        title="Reiniciar"
                      >
                        <RefreshCw size={20} />
                      </button>
                    </div>

                    <TransformComponent
                      wrapperClass="!w-full !h-full"
                      contentClass="!w-full !h-full flex items-center justify-center p-4"
                    >
                      <motion.div
                        ref={contentRef}
                        key={selectedIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}

                        drag={!isZoomed && !isPinching ? true : false}
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.7}
                        onDragEnd={(_e, { offset }) => {
                          const swipeThreshold = 80;
                          const verticalSwipeThreshold = 100;

                          if (offset.y > verticalSwipeThreshold) {
                            setSelectedIndex(null);
                            return;
                          }

                          if (Math.abs(offset.y) < verticalSwipeThreshold) {
                            if (offset.x > swipeThreshold) {
                              handlePrev();
                            }
                            else if (offset.x < -swipeThreshold) {
                              handleNext();
                            }
                          }
                        }}

                        onTap={(event) => {
                          event.stopPropagation();

                          const now = Date.now();
                          const DOUBLE_TAP_DELAY = 300;

                          if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
                            if (instance.transformState.scale > 1) {
                              resetTransform();
                            } else {
                              zoomIn();
                            }
                            lastTapTime.current = 0;
                          } else {
                            lastTapTime.current = now;
                          }
                        }}

                        className="max-w-full max-h-full flex items-center justify-center cursor-pointer"
                      >
                        <img
                          src={images[selectedIndex]}
                          alt="Full view"
                          className={`max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none pointer-events-none ${isZoomed ? 'cursor-move' : ''}`}
                          draggable={false}
                        />
                      </motion.div>
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
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