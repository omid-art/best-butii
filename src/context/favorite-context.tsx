"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface FavoriteItem {
  id: number;
  title: string;
  price: string;
  description: string;
  image: string;
  brand: string;
  category?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (product: FavoriteItem) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  /* =======================
     LOAD USER & FAVORITES
  ======================= */
  useEffect(() => {
    const loadUserFavorites = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      const res = await fetch("http://localhost:5005/users");
      const users = await res.json();

      const user = users.find((u: any) => u.username === username);
      if (!user) return;

      setUserId(user.id);
      setFavorites(user.favorites || []);
    };

    loadUserFavorites();
  }, []);

  /* =======================
     SYNC FAVORITES WITH SERVER
  ======================= */
  useEffect(() => {
    if (!userId) return;

    const syncFavorites = async () => {
      await fetch(`http://localhost:5005/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites }),
      });
    };

    syncFavorites();
  }, [favorites, userId]);

  /* =======================
     FAVORITES ACTIONS
  ======================= */
  const addToFavorites = (product: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const isFavorite = (productId: number) => {
    return favorites.some((item) => item.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
};
