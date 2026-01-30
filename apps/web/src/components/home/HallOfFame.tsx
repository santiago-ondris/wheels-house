import { motion } from "framer-motion";
import { Trophy, Star, Code, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getFeaturedHoFMembers, HallOfFameMember } from "../../services/profile.service";
import { Link } from "react-router-dom";

export default function HallOfFame() {
  const [collectors, setCollectors] = useState<HallOfFameMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFeaturedHoFMembers()
      .then(data => setCollectors(data))
      .catch(err => console.error("Error fetching HoF members:", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading && collectors.length === 0) return null;

  return (
    <section className="bg-[#050505] py-16 md:py-20 overflow-hidden relative border-b border-white/5">
       {/* Background technical accents */}
       <div className="absolute top-0 right-0 w-[500px] h-full bg-linear-to-l from-accent/5 to-transparent pointer-events-none" />
       
       <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-6">
           <div className="max-w-xl">
              <span className="text-accent font-mono text-xs tracking-[0.3em] font-bold uppercase mb-4 block">// COLECCIONISTAS IMPORTANTES</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.8]">
                 Salón de la <br />
                 <span className="text-white/20 italic">Fama</span>
              </h2>
           </div>
           <p className="text-white/40 font-mono text-sm max-w-xs border-r border-white/10 pr-6 text-right hidden md:block">
             RECONOCIMIENTO A COLECCIONISTAS QUE APOYAN WHEELS HOUSE A SU MANERA
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collectors.map((collector, index) => (
             <motion.div
                key={collector.userId}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
             >
                <div className="absolute inset-0 bg-accent/5 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative bg-[#0a0a0b] border border-white/10 rounded-[3rem] p-8 h-full flex flex-col items-center text-center overflow-hidden">
                   {/* Technical Scanlines on Hover */}
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity bg-[url('/scanlines.png')] bg-repeat" />

                   {/* Avatar with dynamic ring */}
                   <div className={`relative mb-6 p-1 rounded-full ring-2 ${
                     collector.hallOfFameFlags?.isLegend ? 'ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' :
                     collector.hallOfFameFlags?.isAmbassador ? 'ring-purple-500' :
                     collector.hallOfFameFlags?.isContributor ? 'ring-emerald-500' : 'ring-sky-500'
                   }`}>
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#0a0a0b]">
                         <img 
                            src={collector.picture || `https://ui-avatars.com/api/?name=${collector.firstName}+${collector.lastName}&background=random`} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            alt={collector.username}
                         />
                      </div>
                      
                      {/* Badge Icon */}
                      <div className={`absolute -bottom-2 -right-2 p-3 rounded-2xl shadow-xl ${
                        collector.hallOfFameFlags?.isLegend ? 'bg-amber-500' :
                        collector.hallOfFameFlags?.isAmbassador ? 'bg-purple-500' :
                        collector.hallOfFameFlags?.isContributor ? 'bg-emerald-500' : 'bg-sky-500'
                      }`}>
                         {collector.hallOfFameFlags?.isLegend ? <Star className="w-5 h-5 text-black fill-black" /> :
                          collector.hallOfFameFlags?.isAmbassador ? <Trophy className="w-5 h-5 text-white" /> :
                          collector.hallOfFameFlags?.isContributor ? <Code className="w-5 h-5 text-white" /> : 
                          <Users className="w-5 h-5 text-white" />}
                      </div>
                   </div>

                   <div className="mb-6">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1 select-none">@{collector.username}</h3>
                      <p className={`font-mono text-[10px] tracking-widest font-black uppercase flex items-center justify-center gap-2 ${
                        collector.hallOfFameFlags?.isLegend ? 'text-amber-500' :
                        collector.hallOfFameFlags?.isAmbassador ? 'text-purple-500' :
                        collector.hallOfFameFlags?.isContributor ? 'text-emerald-500' : 
                        collector.hallOfFameFlags?.isFounder ? 'text-sky-500' : 'text-accent'
                      }`}>
                         <span className={`w-2 h-2 rounded-full animate-pulse ${
                            collector.hallOfFameFlags?.isLegend ? 'bg-amber-500' :
                            collector.hallOfFameFlags?.isAmbassador ? 'bg-purple-500' :
                            collector.hallOfFameFlags?.isContributor ? 'bg-emerald-500' : 
                            collector.hallOfFameFlags?.isFounder ? 'bg-sky-500' : 'bg-accent'
                         }`} />
                         {collector.hallOfFameTitle || (
                            collector.hallOfFameFlags?.isLegend ? 'LEYENDA' : 
                            collector.hallOfFameFlags?.isAmbassador ? 'EMBAJADOR' : 
                            collector.hallOfFameFlags?.isContributor ? 'COLABORADOR' : 
                            collector.hallOfFameFlags?.isFounder ? 'FUNDADOR' : 'MIEMBRO'
                         )}
                      </p>
                   </div>

                   <div className="w-full h-px bg-white/5 mb-6" />

                   <div className="flex justify-between w-full mb-8">
                      <div className="text-left">
                         <span className="block text-white/20 font-mono text-[8px] uppercase tracking-widest mb-1">Autos</span>
                         <span className="text-xl font-mono text-white/60 font-black">{collector.carCount}</span>
                      </div>
                      <div className="text-right">
                         <span className="block text-white/20 font-mono text-[8px] uppercase tracking-widest mb-1">Likes</span>
                         <span className="text-xl font-mono text-white/60 font-black">{collector.totalLikes}</span>
                      </div>
                   </div>

                   {/* Best Car Preview */}
                   {collector.showcaseCarImage && (
                     <div className="w-full mt-auto">
                        <div className="relative h-28 rounded-2xl overflow-hidden mb-2">
                           <img 
                              src={collector.showcaseCarImage} 
                              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                              alt={collector.showcaseCarName || ""}
                           />
                           <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0b] to-transparent" />
                        </div>
                        <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest block truncate">
                          SHOWCASE: {collector.showcaseCarName}
                        </span>
                     </div>
                   )}

                   <Link 
                      to={`/collection/${collector.username}`}
                      className="mt-6 text-[14px] font-mono text-white/50 group-hover:text-accent border border-white/10 px-4 py-2 rounded-lg transition-colors"
                   >
                    VER PERFIL COMPLETO
                   </Link>
                </div>
             </motion.div>
          ))}
        </div>
       </div>
    </section>
  );
}
