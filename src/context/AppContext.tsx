import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Favourite, SaveFavouriteDto } from "@/lib/api/types";
import { authApi } from "@/lib/api/auth";
import { favoritesApi } from "@/lib/api/favorites";
import { toast } from "sonner";

interface AppCtx {
  favorites: Favourite[];
  toggleFavorite: (product: SaveFavouriteDto) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  theme: "dark" | "light";
  toggleTheme: () => void;
  user: User | null;
  loadingUser: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favourite[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchFavorites = async () => {
    if (!localStorage.getItem("accessToken")) return;
    try {
      const res = await favoritesApi.getFavorites();
      if (res && Array.isArray(res)) {
        setFavorites(res);
      } else if (res && (res as any).data) { // Fallback if it has standard response wrapper
        setFavorites((res as any).data);
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const fetchUser = async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      setFavorites([]);
      return;
    }
    try {
      setLoadingUser(true);
      const res = await authApi.getProfile();
      if (res && res.data) {
        setUser(res.data);
        fetchFavorites();
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

  const toggleFavorite = async (product: SaveFavouriteDto) => {
    if (!user) {
      toast.error("Please log in to save favorites.");
      return;
    }
    try {
      const existingFav = favorites.find((f) => f.title === product.title);
      if (existingFav) {
        await favoritesApi.removeFavorite(existingFav.id);
        setFavorites((f) => f.filter((x) => x.id !== existingFav.id));
        toast.success("Removed from favorites");
      } else {
        const res = await favoritesApi.saveFavorite(product);
        const newFav = res && (res as any).data ? (res as any).data : res;
        setFavorites((f) => [...f, newFav]);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      toast.error("Failed to save favorite.");
    }
  };

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
      setFavorites([]);
    }
  };

  return (
    <Ctx.Provider
      value={{
        favorites,
        toggleFavorite,
        fetchFavorites,
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
