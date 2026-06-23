import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/lib/api/types";
import { authApi } from "@/lib/api/auth";

interface AppCtx {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  user: User | null;
  loadingUser: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }
    try {
      setLoadingUser(true);
      const res = await authApi.getProfile();
      if (res && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleFavorite = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout request failed:", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setUser(null);
    }
  };

  return (
    <Ctx.Provider
      value={{
        favorites,
        toggleFavorite,
        theme,
        toggleTheme,
        user,
        loadingUser,
        fetchUser,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
};
