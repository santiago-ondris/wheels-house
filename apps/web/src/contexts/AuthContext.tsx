import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/auth.service";

import { getPublicProfile } from "../services/profile.service";

interface User {
  userId: number;
  username: string;
  picture?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  defaultSortPreference?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  updatePicture: (newPicture: string) => void;
  updateDefaultSort: (newSort: string) => void;
  isLoginModalOpen: boolean;
  loginModalMessage: string;
  openLoginModal: (message?: string) => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): { username: string, userId: number } | null {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function getInitialUser(): User | null {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    username: decoded.username,
    userId: decoded.userId,
    // Other fields will be populated by the useEffect
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser());
  const [isLoading, setIsLoading] = useState(!getInitialUser()); // Loading if no initial user
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState("");
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
          if (decoded) {
            try {
              const profile = await getPublicProfile(decoded.username);
              setUser({
                username: decoded.username,
                userId: decoded.userId,
                picture: profile.picture,
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                defaultSortPreference: profile.defaultSortPreference,
                isAdmin: profile.isAdmin
              });
            } catch {
              setUser({
                username: decoded.username,
                userId: decoded.userId,
                defaultSortPreference: 'id:desc'
              });
            }
          } else {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
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

    if (decoded) {
      // Fetch user picture from profile
      try {
        const profile = await getPublicProfile(decoded.username);
        setUser({
          username: decoded.username,
          userId: decoded.userId,
          picture: profile.picture,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          defaultSortPreference: profile.defaultSortPreference,
          isAdmin: profile.isAdmin
        });
      } catch {
        setUser({
          username: decoded.username,
          userId: decoded.userId,
          defaultSortPreference: 'id:desc'
        });
      }
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
        isLoginModalOpen,
        loginModalMessage,
        openLoginModal: (message = "") => {
          setLoginModalMessage(message);
          setIsLoginModalOpen(true);
        },
        closeLoginModal: () => {
          setIsLoginModalOpen(false);
          setLoginModalMessage("");
        },
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