import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import LoginModal from "../../components/auth/LoginModal";

export default function AuthRequiredPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-8"
    >
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-accent" />
        </div>

        <h1 className="text-3xl font-bold text-white">Acceso restringido</h1>

        <p className="text-white/60">
          Necesitás iniciar sesión para acceder a esta sección.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-bold rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>

          <Link
            to="/register"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors"
          >
            Crear cuenta
          </Link>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </motion.div>
  );
}