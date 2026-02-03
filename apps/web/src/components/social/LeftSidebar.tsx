import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Home,
  Car,
  Folder,
  Star,
  BarChart2,
  Settings,
  Plus,
  User as UserIcon,
  Users,
  Trophy,
  LayoutGrid
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getPublicProfile,
  PublicProfile,
} from "../../services/profile.service";
import { getOptimizedUrl } from "../../lib/cloudinary";

export default function LeftSidebar() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<PublicProfile | null>(null);

  useEffect(() => {
    if (user?.username) {
      getPublicProfile(user.username)
        .then(setProfile)
        .catch(() => { });
    }
  }, [user?.username]);

  const navItems = isAuthenticated
    ? [
      { label: "Inicio", path: "/", icon: Home },
      { label: "Mi Colección", path: `/collection/${user?.username}`, icon: Car },
      { label: "Mis Grupos", path: `/collection/${user?.username}/groups`, icon: Folder },
      { label: "Mi Wishlist", path: `/wishlist/${user?.username}`, icon: Star },
      { label: "Mi Red", path: "/people", icon: Users },
      { label: "Mis Estadísticas", path: `/collection/${user?.username}/stats`, icon: BarChart2 },
      { label: "Configuración", path: "/settings", icon: Settings },
    ]
    : [
      { label: "Inicio", path: "/", icon: Home },
      { label: "Comunidad", path: "/community", icon: LayoutGrid },
      { label: "Salón de la Fama", path: "/hall-of-fame", icon: Trophy },
    ];

  return (
    <aside className="w-full flex flex-col gap-6 py-6 sticky top-[calc(var(--navbar-height)+3.5rem)] h-[calc(100vh-var(--navbar-height)-3.5rem)] overflow-y-auto scrollbar-hide pr-4 transition-[top,height] duration-500">
      {/* User Mini Profile or Guest CTA */}
      {isAuthenticated && user ? (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-zinc-800 flex items-center justify-center shrink-0">
              {user.picture ? (
                <img
                  src={getOptimizedUrl(user.picture, 'avatar')}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-6 h-6 text-zinc-600" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                @{user.username}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                {profile?.totalCars || 0} autos · {profile?.totalGroups || 0}{" "}
                grupos
              </p>
            </div>
          </div>
          <Link
            to={`/collection/${user.username}`}
            className="text-[10px] text-center font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 py-2 rounded-lg border border-white/5"
          >
            Ver mi perfil
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-white font-black text-sm uppercase tracking-tighter leading-tight">
            Unite a la red de coleccionistas
          </h3>
          <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
            Crea tu perfil, organiza tu colección y conecta con otros entusiastas.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 bg-accent text-black py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all hover:scale-[1.02]"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-4 mb-2">
          Navegación
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                ? "bg-accent/10 text-accent"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive
                  ? "text-accent"
                  : "text-zinc-600 group-hover:text-zinc-400"
                  }`}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Action */}
      {isAuthenticated && (
        <button
          onClick={() => navigate("/collection/add")}
          className="mt-2 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all active:scale-[0.98] shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4" />
          Agregar Auto
        </button>
      )}
    </aside>
  );
}
