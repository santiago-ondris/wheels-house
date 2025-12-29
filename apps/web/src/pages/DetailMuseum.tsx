import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Share2, ArrowLeft, ArrowRight } from "lucide-react";
import { HotWheel } from "../../../../packages/shared";

const mockCar: HotWheel & { images: string[] } = {
  id: "2",
  name: "Porsche 911 GT3 RS",
  brand: "Porsche",
  manufacturer: "Mattel",
  year: 2016,
  color: "Lava Orange",
  series: "Factory Fresh",
  castingNumber: "2/10",
  images: [
    "/cars/foto-frontal.jpg", 
    "/cars/foto-lateral.jpg",
    "/cars/foto-trasera.jpg",
    "/cars/foto-detalle.jpg",
  ],
  notes: "Captura la esencia de la ingeniería alemana. Pintura Spectraflame con detalles en los faros.",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const DetailMuseum = () => {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white overflow-x-hidden flex flex-col">
      
      {/* --- FONDO AMBIENTAL --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-screen h-[80vh] bg-[radial-gradient(ellipse_at_center,#2A2359_0%,transparent_70%)] opacity-20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* --- HEADER FLOTANTE --- */}
      <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
             <span className="text-[10px] tracking-[0.3em] uppercase text-gray-500 font-bold border-l-2 border-primary pl-3">
                Exhibit {mockCar.id}
             </span>
        </div>
        <div className="flex gap-4 pointer-events-auto">
            <button 
                onClick={() => setShowInfo(!showInfo)}
                className="p-3 rounded-full bg-black/20 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
            >
                {showInfo ? <X size={20} /> : <Info size={20} />}
            </button>
            <button className="p-3 rounded-full bg-primary shadow-[0_0_15px_var(--color-primary)] hover:bg-secondary transition-colors">
                <Share2 size={20} />
            </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col pt-24 pb-32 md:pb-10 relative z-10">
        
        {/* VERSION CELU */}
        <div className="md:hidden w-full mb-6">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-8 scrollbar-hide items-center">
                {mockCar.images.map((img, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="snap-center shrink-0 relative w-[85vw] aspect-4/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]"
                    >
                        <img src={img} alt={`View ${index}`} className="w-full h-full object-contain p-4" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
                    </motion.div>
                ))}
                <div className="w-2 shrink-0" />
            </div>
            
            <div className="flex justify-center gap-6 text-gray-500 text-xs items-center animate-pulse">
                <ArrowLeft size={14} />
                <span className="tracking-widest uppercase">Desliza para ver</span>
                <ArrowRight size={14} />
            </div>
        </div>

        {/* VERSIÓN PC  */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 px-10 w-full max-w-7xl mx-auto h-[60vh] lg:h-[70vh]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] group"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-dark)_0%,transparent_100%)] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <img src={mockCar.images[0]} className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105" alt="Main view" />
            </motion.div>

            <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 }}
                 className="col-span-2 row-span-1 relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] group"
            >
                 <img src={mockCar.images[1]} className="w-full h-full object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity" alt="Detail view 1" />
            </motion.div>

            <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] group"
            >
                 <img src={mockCar.images[2]} className="w-full h-full object-contain p-2 opacity-60 group-hover:opacity-100 transition-opacity" alt="Detail view 2" />
            </motion.div>

            <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] flex items-center justify-center group cursor-pointer"
            >
                {mockCar.images[3] ? (
                    <img src={mockCar.images[3]} className="w-full h-full object-contain p-2 opacity-60 group-hover:opacity-100 transition-opacity" alt="Detail view 3" />
                ) : (
                    <span className="text-gray-600 text-xs uppercase tracking-widest group-hover:text-white transition-colors">Ver más</span>
                )}
            </motion.div>
        </div>

      </main>

      <AnimatePresence>
        {showInfo && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 w-full z-40 bg-linear-to-t from-black via-black/95 to-transparent pt-12 pb-8 px-6 md:px-10"
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="font-arvo text-4xl md:text-6xl text-white mb-2">{mockCar.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="bg-white/10 px-2 py-1 rounded text-xs text-white font-bold tracking-wider">{mockCar.year}</span>
                            <span>{mockCar.brand}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full" />
                            <span className="italic">{mockCar.series} Series</span>
                        </div>
                    </div>
                    
                    <div className="md:max-w-md border-l border-white/20 pl-4">
                        <p className="text-gray-400 text-sm leading-relaxed">{mockCar.notes}</p>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DetailMuseum;