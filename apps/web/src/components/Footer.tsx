export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0b] border-t border-white/5 pt-16 pb-12 mt-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          {/* Logo & Info Field */}
          <div className="col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-accent flex items-center justify-center -skew-x-12">
                  <span className="text-dark font-black text-[10px] italic skew-x-12 leading-none">WH</span>
                </div>
                <span className="text-xl font-black text-white italic tracking-tighter uppercase">WHEELS_HOUSE</span>
              </div>
              <div className="inline-block px-2 py-0.5 bg-accent/10 border-l-2 border-accent">
                <span className="text-[9px] font-mono font-bold text-accent uppercase tracking-[0.2em]">
                  ESTADO_SISTEMA: ESTABLE.V0.7.4
                </span>
              </div>
            </div>

            <p className="text-white/30 font-mono text-[12px] leading-relaxed max-w-sm uppercase tracking-wider">
              Almacén digital premium para documentación de vehículos a escala de alta precisión.
              Diseñado para coleccionistas de cualquier tipo.
            </p>
          </div>

          {/* Company Field */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white/20">
              <div className="w-1 h-3 bg-white/10" />
              <h4 className="text-[14px] font-mono font-black uppercase tracking-[0.2em]">Información</h4>
            </div>
            <ul className="space-y-3">
              <li><button className="group flex items-center gap-2 text-white/40 hover:text-white font-mono text-[12px] uppercase transition-all tracking-widest">
                <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">//</span> Sobre_nosotros
              </button></li>
              <li><button className="group flex items-center gap-2 text-white/40 hover:text-white font-mono text-[12px] uppercase transition-all tracking-widest">
                <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">//</span> Roadmap
              </button></li>
              <li><button className="group flex items-center gap-2 text-white/40 hover:text-white font-mono text-[12px] uppercase transition-all tracking-widest">
                <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">//</span> Política_de_privacidad
              </button></li>
              <li><button className="group flex items-center gap-2 text-white/40 hover:text-white font-mono text-[12px] uppercase transition-all tracking-widest">
                <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">//</span> Términos_y_condiciones
              </button></li>
            </ul>
          </div>

          {/* Support Field */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white/20">
              <div className="w-1 h-3 bg-white/10" />
              <h4 className="text-[14px] font-mono font-black uppercase tracking-[0.2em]">Contacto</h4>
            </div>
            <ul className="space-y-3">
              <li><button className="group flex items-center gap-2 text-white/40 hover:text-white font-mono text-[12px] uppercase transition-all tracking-widest">
                <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">//</span> Contactanos
              </button></li>
              <li><button className="group flex items-center gap-2 text-white/40 hover:text-white font-mono text-[12px] uppercase transition-all tracking-widest">
                <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">//</span> Proponer_Mejoras
              </button></li>
            </ul>
          </div>
        </div>

        {/* Console Footbar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-white/10 rounded-full" />)}
            </div>
            <p className="text-emerald-500 font-mono text-[9px] uppercase tracking-[0.3em]">
              Wheels_House © 2026 // DE_COLECCIONISTAS_PARA_COLECCIONISTAS
            </p>
          </div>

          <div className="hidden md:flex gap-8">
            <div className="text-[9px] font-mono text-white/10 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 animate-pulse" />
              Data_Stream: Secure
            </div>
            <div className="text-[9px] font-mono text-white/10 uppercase tracking-widest">
              Region: Global_LATAM
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
