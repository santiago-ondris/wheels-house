import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getGlobalStats, GlobalStats } from "../../services/profile.service";
import { useAuth } from "../../contexts/AuthContext";

export default function ScaleAndTrust() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<GlobalStats>({
    totalCars: 10420,
    totalUsers: 1250,
    totalPhotos: 50000
  });

  useEffect(() => {
    getGlobalStats()
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching global stats:", err));
  }, []);

  return (
    <section className="bg-[#050a0a] py-12 relative overflow-hidden border-y border-white/5">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Decorative Technical Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-accent/20 via-transparent to-accent/20" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-linear-to-b from-accent/20 via-transparent to-accent/20" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6 border-b border-white/10 pb-8">
            <div className="max-w-xl">
                <span className="text-secondary font-mono text-xs tracking-widest uppercase mb-2 block">System Analytics // Ver 2.0</span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter">
                    LA RED DE COLECCIONISTAS <br/>
                    <span className="text-accent underline decoration-white/20 underline-offset-8">DE TODOS PARA TODOS</span>
                </h2>
            </div>
             {!isAuthenticated && (
              <Link
                to="/register"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-accent text-white font-mono text-sm font-bold rounded-lg hover:bg-accent/80 transition-all border border-white/10"
              >
                UNITE A NOSOTROS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
             )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="py-8 md:py-0 md:px-8">
              <Counter value={stats.totalCars} label="Autos Subidos" />
          </div>
          <div className="py-8 md:py-0 md:px-8">
              <Counter value={stats.totalUsers} label="Coleccionistas Activos" />
          </div>
          <div className="py-8 md:py-0 md:px-8">
              <Counter value={stats.totalPhotos} label="Fotos Subidas" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, { duration: 3000, bounce: 0 });
  const displayValue = useTransform(springValue, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, value, springValue]);

  return (
    <div ref={ref} className="text-left md:text-center group">
      <div className="flex items-baseline gap-1 mb-1">
          <motion.p className="text-5xl md:text-7xl font-black text-white font-mono tracking-tighter">
            <motion.span>{displayValue}</motion.span>
          </motion.p>
          <span className="text-accent text-2xl font-black">+</span>
      </div>
      <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.2em] font-mono group-hover:text-white/60 transition-colors">{label}</p>
    </div>
  );
}
