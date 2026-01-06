import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserX } from "lucide-react";

export default function UserNotFoundPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
        >
            <div className="bg-white/5 rounded-full p-6 mb-6">
                <UserX className="w-16 h-16 text-accent/60" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Usuario no encontrado</h1>
            <p className="text-white/60 mt-2 text-center max-w-md">
                El usuario que buscas no existe o el perfil ya no está disponible.
            </p>
            <Link
                to="/"
                className="mt-8 px-6 py-3 bg-accent hover:bg-accent/80 text-white rounded-lg transition-all"
            >
                Volver al inicio
            </Link>
        </motion.div>
    );
}
