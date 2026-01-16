import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/auth.service";

import { getPublicProfile } from "../services/profile.service";

interface User {
  username: string;
  picture?: string;
  defaultSortPreference?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  updatePicture: (newPicture: string) => void;
  updateDefaultSort: (newSort: string) => void;
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

  const logout = useCallback(() => {
    navigate("/", { replace: true });
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
    }, 50);
  }, [navigate]);

  // Listen for session-expired events from API interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      let token = localStorage.getItem("auth_token");
      const refreshToken = localStorage.getItem("refresh_token");

      // If no access token but refresh token exists, try to refresh
      if (!token && refreshToken) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('auth_token', data.accessToken);
            token = data.accessToken;
          } else {
            // Refresh failed, clear everything
            localStorage.removeItem("refresh_token");
          }
        } catch {
          localStorage.removeItem("refresh_token");
        }
      }

      if (token) {
        try {
          const decoded = decodeToken(token);
          try {
            const profile = await getPublicProfile(decoded.username);
            setUser({ username: decoded.username, picture: profile.picture, defaultSortPreference: profile.defaultSortPreference });
          } catch {
            setUser({ username: decoded.username, defaultSortPreference: 'id:desc' });
          }
        } catch {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const response = await loginService({ usernameOrEmail, password });

    // Store both tokens
    localStorage.setItem("auth_token", response.accessToken);
    localStorage.setItem("refresh_token", response.refreshToken);

    const decoded = decodeToken(response.accessToken);

    // Fetch user picture from profile
    try {
      const profile = await getPublicProfile(decoded.username);
      setUser({ username: decoded.username, picture: profile.picture, defaultSortPreference: profile.defaultSortPreference });
    } catch {
      setUser({ username: decoded.username, defaultSortPreference: 'id:desc' });
    }
  };

  const updatePicture = (newPicture: string) => {
    if (user) {
      setUser({ ...user, picture: newPicture || undefined });
    }
  };

  const updateDefaultSort = (newSort: string) => {
    if (user) {
      setUser({ ...user, defaultSortPreference: newSort });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updatePicture,
        updateDefaultSort,
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