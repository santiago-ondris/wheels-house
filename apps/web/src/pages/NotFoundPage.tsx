import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col items-center justify-center p-8"
    >
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="text-white/60 mt-2">Página no encontrada</p>
      <Link to="/" className="mt-6 text-accent hover:underline">
        Volver al inicio
      </Link>
    </motion.div>
  );
}