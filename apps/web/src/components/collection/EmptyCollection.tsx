import { motion } from "framer-motion";
import { Car, Plus } from "lucide-react";

interface EmptyCollectionProps {
    onAddCar: () => void;
}

export default function EmptyCollection({ onAddCar }: EmptyCollectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
        >
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                <div className="relative bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                    <Car className="w-16 h-16 text-accent/50" />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Tu colección está vacía</h3>
            <p className="text-white/40 max-w-md mb-8">
                Todavía no agregaste ningún vehículo a tu garage.
                ¡Empezá ahora y mostrá tu colección!
            </p>

            <button
                onClick={onAddCar}
                className="group relative px-8 py-4 bg-accent hover:bg-accent/80 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
                <Plus className="w-5 h-5" />
                Agregar mi primer auto
            </button>
        </motion.div>
    );
}
