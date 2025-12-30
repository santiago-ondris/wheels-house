import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HotWheel } from "../../../../packages/shared/src"; 
import { CarMasonryGrid } from "../components/cars/CarMasonryGrid";
import { ArrowDown, ArrowUp } from "lucide-react";

// MOCK DATA
const mockCar: HotWheel & { images: string[] } = {
  id: "2",
  name: "Porsche 911 GT3 RS",
  brand: "Porsche",
  manufacturer: "Hot Wheels",
  year: 2016,
  color: "Celeste",
  series: "Factory Fresh",
  images: [
    "/cars/foto-frontal.jpg", 
    "/cars/foto-lateral.jpg",
    "/cars/foto-trasera.jpg",
    "/cars/foto-detalle.jpg",
    "/cars/foto-lateral.jpg", 
    "/cars/foto-frontal.jpg",
    "/cars/foto-frontal.jpg", 
    "/cars/foto-frontal.jpg", 
    "/cars/foto-frontal.jpg", 
    "/cars/foto-frontal.jpg",  
  ],
  notes: "Esta es una nota de descripcion del vehiculo super detallada",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const CarDetailPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const galleryRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      };
  
    return (
      <div className="w-full min-h-screen bg-background text-white flex flex-col font-arvo">
      
      <section ref={galleryRef} className="w-full pt-6 md:pt-10 pb-10 px-4 md:px-10">
        <div className="max-w-7xl mx-auto mb-6">
             <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-sm text-gray-400 mb-4"
             >
                <span className="uppercase tracking-widest">{mockCar.brand}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"/>
                <span className="text-white font-bold">{mockCar.name}</span>
             </motion.div>
             <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => scrollTo(detailsRef)}
                className="text-xs text-emerald-400/80 hover:text-emerald-400 flex items-center gap-2 transition-colors uppercase tracking-widest font-bold cursor-pointer"
            >
                Ir a detalles <ArrowDown size={14} />
            </motion.button>
        </div>

        <CarMasonryGrid images={mockCar.images} />
      </section>

      <main ref={detailsRef} className="flex-1 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex flex-col lg:flex-row gap-16">
            
            <div className="flex-1">
                <div className="flex justify-end mb-2">
                    <button 
                        onClick={() => scrollTo(galleryRef)}
                        className="text-xs text-gray-600 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-widest"
                    >
                        Ir a galería <ArrowUp size={14} />
                    </button>
                </div>
                <h1 className="text-5xl md:text-7xl text-white mb-6 font-bold leading-tight">
                    {mockCar.name}
                </h1>
                
                <div className="flex flex-wrap gap-3 mb-10">
                    <span className="px-4 py-2 bg-white text-black text-sm font-bold uppercase rounded-full tracking-wide">
                        {mockCar.year}
                    </span>
                    <span className="px-4 py-2 border border-white/20 text-white text-sm font-bold uppercase rounded-full tracking-wide">
                        {mockCar.series}
                    </span>
                </div>

                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                    {mockCar.notes || "Una pieza icónica para cualquier colección."}
                </p>
            </div>

            <div className="lg:w-1/3 bg-white/5 rounded-2xl p-8 border border-white/10 h-fit">
                <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-white/10">Especificaciones</h3>
                
                <ul className="space-y-6">
                    <InfoRow label="Marca" value={mockCar.brand} />
                    <InfoRow label="Color" value={mockCar.color} />
                    <InfoRow label="Series" value={mockCar.series || "-"} />
                    <InfoRow label="Fabricante" value={mockCar.manufacturer} />
                </ul>
            </div>
        </div>
      </main>

    </div>
  );
};

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <li className="flex justify-between items-center">
        <span className="text-gray-500 text-sm uppercase tracking-wider">{label}</span>
        <span className="text-white font-medium text-right">{value}</span>
    </li>
);

export default CarDetailPage;