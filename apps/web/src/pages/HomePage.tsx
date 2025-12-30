import { motion } from "framer-motion";
import { Car, Layers, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import LoginModal from "../components/auth/LoginModal";
import { useAuth } from "../contexts/AuthContext";

const features = [
  {
    icon: Car,
    title: "Mi Colección",
    description: "Todos tus Hot Wheels en un solo lugar, organizados y con imágenes.",
    href: "/collection",
  },
  {
    icon: Layers,
    title: "Mis Grupos",
    description: "Agrupa tus autos por series, colores, o como quieras.",
    href: "/groups",
  },
  {
    icon: Star,
    title: "Wishlist",
    description: "Guarda los que te faltan y no pierdas el rastro.",
    href: "/wishlist",
  },
];

const featuredCar = {
  name: "'71 Datsun 510",
  series: "Japan Historics",
  year: 2024,
  image: "https://placehold.co/400x300/1A1B4B/D9731A?text=Datsun+510",
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-secondary/20" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-6 py-20">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-accent uppercase tracking-widest text-sm font-bold">
              Collection Manager
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white mt-4 leading-tight">
              WHEELS
              <br />
              HOUSE
            </h1>
            <p className="text-white/60 text-lg mt-6 max-w-md">
              Tu colección de Hot Wheels organizada, accesible desde cualquier lugar, con imágenes y grupos personalizados.
            </p>
          {isAuthenticated ? (
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-accent hover:bg-accent/80 text-white font-bold rounded-lg transition-colors"
            >
              Ir a mi colección
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-accent hover:bg-accent/80 text-white font-bold rounded-lg transition-colors"
            >
              Login
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          </motion.div>
        </div>
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <section className="container mx-auto px-6 py-20">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Explora tus
            <br />
            opciones
          </h2>
          <span className="text-accent uppercase tracking-widest text-sm">
            01 / Features
          </span>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={feature.href}
                className="group block h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <span className="text-accent/60 text-sm">0{index + 1}</span>
                <feature.icon className="w-10 h-10 text-accent mt-4" />
                <h3 className="text-xl font-bold text-white mt-4">
                  {feature.title}
                </h3>
                <p className="text-white/50 mt-2 text-sm">
                  {feature.description}
                </p>
                <span className="inline-flex items-center gap-1 text-accent text-sm mt-4 group-hover:gap-2 transition-all">
                  Explorar
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Elegido
            <br />
            del día
          </h2>
          <span className="text-accent uppercase tracking-widest text-sm">
            02 / Featured
          </span>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden md:flex"
        >
          <div className="md:w-1/2">
            <img
              src={featuredCar.image}
              alt={featuredCar.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <span className="text-accent uppercase tracking-widest text-sm">
              {featuredCar.series}
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-white mt-2">
              {featuredCar.name}
            </h3>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50 uppercase tracking-widest">Año</span>
                <span className="text-white">{featuredCar.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50 uppercase tracking-widest">Serie</span>
                <span className="text-white">{featuredCar.series}</span>
              </div>
            </div>
            <button className="mt-8 px-6 py-3 bg-accent hover:bg-accent/80 text-white font-bold rounded-lg transition-colors w-fit">
              Ver detalles
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}