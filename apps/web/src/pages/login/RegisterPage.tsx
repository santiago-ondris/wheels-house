import { motion } from "framer-motion";
import { Car } from "lucide-react";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/20 rounded-xl">
              <Car className="w-8 h-8 text-accent" />
            </div>
            <span className="text-white font-bold text-2xl">Wheels House</span>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Comenzá tu
              <br />
              colección
            </h1>
            <p className="text-white/60 text-lg">
              Organizá tus modelos, creá grupos personalizados y accedé a tu colección desde cualquier lugar.
            </p>
          </div>

          <div className="hidden md:block space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2" />
              <div>
                <h3 className="text-white font-bold">Gestión completa</h3>
                <p className="text-white/50 text-sm">Agregá, editá y organizá toda tu colección</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              <div>
                <h3 className="text-white font-bold">Grupos personalizados</h3>
                <p className="text-white/50 text-sm">Categorizá por serie, color o lo que quieras</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
              <div>
                <h3 className="text-white font-bold">Acceso desde cualquier lugar</h3>
                <p className="text-white/50 text-sm">Compartila con quien quieras</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Crear cuenta</h2>
            <p className="text-white/50 text-sm">Completá tus datos para comenzar</p>
          </div>

          <RegisterForm />
        </motion.div>

      </div>
    </div>
  );
}