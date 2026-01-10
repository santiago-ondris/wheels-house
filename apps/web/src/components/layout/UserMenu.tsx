import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {user.username[0].toUpperCase()}
          </span>
        </div>
        <span className="text-white text-sm hidden md:block">{user.username}</span>
        <ChevronDown className="w-4 h-4 text-white/60" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-dark/95 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b border-white/10">
            <p className="text-white font-bold text-sm">{user.username}</p>
          </div>

          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate("/settings")}
                  className={`${active ? "bg-white/10" : ""
                    } flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white text-sm transition-colors`}
                >
                  <User className="w-4 h-4" />
                  Mi Perfil
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${active ? "bg-danger/20" : ""
                    } flex items-center gap-2 w-full px-3 py-2 rounded-lg text-danger text-sm transition-colors`}
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}