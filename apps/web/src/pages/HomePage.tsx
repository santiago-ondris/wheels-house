import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import LoginModal from "../components/auth/LoginModal";
import { useAuth } from "../contexts/AuthContext";
import FeaturedCar from "../components/home/FeaturedCar";
import BetaInfoSection from "../components/home/BetaInfoSection";
import FeaturedCollections from "../components/home/FeaturedCollections";
import CommunityPulse from "../components/home/CommunityPulse";
import ScaleAndTrust from "../components/home/ScaleAndTrust";
import HallOfFame from "../components/home/HallOfFame";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col">
      <section className="relative min-h-[auto] md:min-h-[70vh] flex items-center overflow-hidden -mt-[158px]">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-secondary/20" />

        {/* Fade-out gradient at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
          }}
        />

        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-6 pt-36 pb-10 md:pt-44 md:pb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-16">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6 }}
              className="max-w-2xl relative z-10 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mt-3 md:mt-4 leading-tight">
                Organizá.
                <br />
                <span className="text-accent">Compartí.</span>
                <br />
                Coleccioná.
              </h1>
              <p className="hidden md:block text-white/60 text-base md:text-lg mt-4 md:mt-6 max-w-md mx-auto md:mx-0">
                Tu colección de vehículos a escala organizada, accesible desde cualquier lugar, con imágenes, grupos personalizados y lista para compartir.
              </p>

              {/* Mobile Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="md:hidden w-full max-w-[260px] mx-auto mt-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full" />
                  <img
                    src="/heroimage.png"
                    alt="Wheels House Hero"
                    className="w-full h-auto object-contain drop-shadow-xl relative z-10"
                  />
                </div>
              </motion.div>

              {isAuthenticated ? (
                <Link
                  to={`/collection/${user?.username}`}
                  className="inline-flex items-center gap-2 mt-6 md:mt-8 px-6 py-3 bg-accent hover:bg-accent/80 text-white font-bold rounded-lg transition-colors"
                >
                  Ir a mi colección
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-6 md:mt-8">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent hover:bg-accent/80 text-white font-bold rounded-lg transition-colors border border-accent"
                  >
                    Crear cuenta
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors border border-white/10"
                  >
                    Iniciar sesión
                  </button>
                </div>
              )}
            </motion.div>

            {/* Desktop Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block w-1/2 relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/20 blur-[100px] -z-10 rounded-full" />

              <img
                src="/heroimage.png"
                alt="Wheels House Hero"
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <FeaturedCollections />

      <div className="bg-background relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        <CommunityPulse />
        <ScaleAndTrust />
        <HallOfFame />
      </div>

      <FeaturedCar />

      <BetaInfoSection />
    </div>
  );
}