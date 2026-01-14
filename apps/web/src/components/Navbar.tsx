import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "./layout/UserMenu";
import MobileMenu from "./layout/MobileMenu";
import LoginModal from "./auth/LoginModal";
import UserSearch from "./ui/UserSearch";
import MobileUserSearch from "./ui/MobileUserSearch";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4 relative z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/LOGO.svg" alt="Wheels House Logo" className="h-12 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-6 mr-4">
                  <Link to="/hall-of-fame" className="text-white/70 hover:text-white transition-colors">
                    Salón de la Fama
                  </Link>
                  <Link to={`/collection/${user?.username}`} className="text-white/70 hover:text-white transition-colors">
                    Mi Colección
                  </Link>
                  <div className="w-64">
                    <UserSearch />
                  </div>
                </div>

                <div className="hidden md:block">
                  <UserMenu />
                </div>

                <div className="flex items-center gap-2 md:hidden">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <MobileMenu onLoginClick={() => setIsLoginOpen(true)} />
                </div>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-6">
                  <Link to="/hall-of-fame" className="text-white/70 hover:text-white transition-colors mr-2">
                    Salón de la Fama
                  </Link>
                  <div className="w-64 mr-2">
                    <UserSearch />
                  </div>
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
                    Crear cuenta
                  </Link>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <MobileMenu onLoginClick={() => setIsLoginOpen(true)} />
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search - FUERA del nav para evitar stacking issues */}
      {isSearchOpen && <MobileUserSearch onClose={() => setIsSearchOpen(false)} />}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}