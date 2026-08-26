import { useState, useEffect } from "react";

const AUTH_STORAGE_KEY = "marriage_auth";
const AUTH_TIMESTAMP_KEY = "marriage_auth_timestamp";

// Session timeout: 2 horas
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante para cookies de sessão
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
        localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout.php", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    }
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/me.php", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            localStorage.setItem(AUTH_STORAGE_KEY, "true");
            localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
          } else {
            // Sessão inválida no servidor
            console.error("[AUTH] me.php: sessão inválida no servidor — limpando e voltando ao home");
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(AUTH_TIMESTAMP_KEY);
            window.location.href = "/";
            return;
          }
        } else {
          // Não autenticado
          console.error(`[AUTH] me.php retornou HTTP ${response.status} — provável cookie de sessão ausente/bloqueado no navegador`);
          window.location.href = "/";
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        window.location.href = "/";
        return;
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Não redirecionar se estiver carregando
  if (isLoading) {
    return false;
  }

  return isAuthenticated;
}
