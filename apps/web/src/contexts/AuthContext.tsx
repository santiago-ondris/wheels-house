import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/auth.service";

import { getPublicProfile } from "../services/profile.service";

interface User {
  username: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): { username: string } {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const decoded = decodeToken(token);
          try {
            const profile = await getPublicProfile(decoded.username);
            setUser({ username: decoded.username, picture: profile.picture });
          } catch {
            setUser({ username: decoded.username });
          }
        } catch {
          localStorage.removeItem("auth_token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const response = await loginService({ usernameOrEmail, password });
    const token = response.authorization;

    localStorage.setItem("auth_token", token);

    const decoded = decodeToken(token);

    // Fetch user picture from profile
    try {
      const profile = await getPublicProfile(decoded.username);
      setUser({ username: decoded.username, picture: profile.picture });
    } catch {
      setUser({ username: decoded.username });
    }
  };

  const logout = () => {
    navigate("/", { replace: true });
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem("auth_token");
    }, 50);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}