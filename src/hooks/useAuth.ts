import { useState, useEffect } from "react";

const AUTH_STORAGE_KEY = "marriage_auth";
const AUTH_TIMESTAMP_KEY = "marriage_auth_timestamp";

// Credenciais hardcoded (conforme solicitado)
const CREDENTIALS = {
  username: "admin",
  password: "leticiaekiury2027",
};

// Session timeout: 2 horas
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  checkSession: () => boolean;
}

export function useAuth(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);

    if (storedAuth === "true" && timestamp) {
      const now = Date.now();
      const loginTime = parseInt(timestamp, 10);

      if (now - loginTime < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
  };

  const checkSession = (): boolean => {
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const now = Date.now();
    const loginTime = parseInt(timestamp, 10);

    if (now - loginTime >= SESSION_TIMEOUT) {
      logout();
      return false;
    }

    return true;
  };

  return { isAuthenticated, login, logout, checkSession };
}

export function useAuthGuard(): boolean {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);

    if (!storedAuth || !timestamp) {
      window.location.href = "/";
      return;
    }

    const now = Date.now();
    const loginTime = parseInt(timestamp, 10);

    if (now - loginTime >= SESSION_TIMEOUT) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
      window.location.href = "/";
      return;
    }

    setIsAuthenticated(true);
  }, []);

  return isAuthenticated;
}
