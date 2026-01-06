import { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "./layout/UserMenu";
import MobileMenu from "./layout/MobileMenu";
import LoginModal from "./auth/LoginModal";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4 relative z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Car className="w-5 h-5 text-accent" />
            </div>
            <span className="text-white font-bold text-xl">Wheels House</span>
          </Link>

          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link to={`/collection/${user?.username}`} className="text-white/70 hover:text-white transition-colors">
                  Mi Colección
                </Link>
                <Link to="/explore" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Explorar
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <UserMenu />
                </div>
                <MobileMenu onLoginClick={() => setIsLoginOpen(true)} />
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 text-white hover:text-accent transition-colors"
                >
                  Iniciar sesión
                </button>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-accent hover:bg-accent/80 text-white font-bold rounded-lg transition-colors"
                >
                  Registrarse
                </Link>
              </div>

              <MobileMenu onLoginClick={() => setIsLoginOpen(true)} />
            </>
          )}
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}