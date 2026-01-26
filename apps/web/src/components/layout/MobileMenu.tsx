import { Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { X, Menu as MenuIcon, Home, Car, LogIn, UserPlus, Trophy, User, Gamepad2, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface MobileMenuProps {
  onLoginClick: () => void;
}

export default function MobileMenu({ onLoginClick }: MobileMenuProps) {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Disclosure as="div" className="md:hidden">
      {({ open, close }) => (
        <>
          <Disclosure.Button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
            {open ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </Disclosure.Button>

          <Transition
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <Disclosure.Panel className="absolute top-full left-0 right-0 mt-2 mx-4 bg-dark/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
              {isAuthenticated ? (
                <div className="p-4 space-y-2">
                  <div className="pb-3 mb-3 border-b border-white/10">
                    <p className="text-white font-bold">{user?.username}</p>
                  </div>

                  <Link
                    to="/"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    Inicio
                  </Link>

                  <Link
                    to="/hall-of-fame"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Trophy className="w-5 h-5" />
                    Salón de la Fama
                  </Link>

                  <Link
                    to="/community"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <LayoutGrid className="w-5 h-5" />
                    Comunidad
                  </Link>

                  <Link
                    to="/people"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-5 h-5 text-accent" />
                    Personas
                  </Link>

                  <Link
                    to="/wheelword"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    WheelWord
                  </Link>

                  <Link
                    to={`/collection/${user?.username}`}
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Car className="w-5 h-5" />
                    Mi Colección
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Editar perfil
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      close();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-danger hover:bg-danger/20 rounded-lg transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  <Link
                    to="/"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    Inicio
                  </Link>

                  <Link
                    to="/hall-of-fame"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Trophy className="w-5 h-5" />
                    Salón de la Fama
                  </Link>

                  <Link
                    to="/wheelword"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    WheelWord
                  </Link>

                  <button
                    onClick={() => {
                      onLoginClick();
                      close();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    Iniciar sesión
                  </button>

                  <Link
                    to="/register"
                    onClick={() => close()}
                    className="flex items-center gap-3 px-4 py-3 text-accent hover:bg-accent/20 rounded-lg transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    Crear cuenta
                  </Link>
                </div>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}