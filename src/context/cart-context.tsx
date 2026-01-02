"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { PaymentData } from "@/context/payment-context";

/* =======================
   TYPES
======================= */
export interface CartItem {
  id: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

export interface FavoriteItem {
  id: string;
  title: string;
  price: string;
  image: string;
  brand:string;
  color : string;
  des : string
}

interface CartContextType {
  cart: CartItem[];
  favorites: FavoriteItem[];

  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;

  addToFavorites: (product: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;

  finalizeOrder: (paymentData: PaymentData) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

/* =======================
   PROVIDER
======================= */
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  /* =======================
     LOAD USER DATA
  ======================= */
  useEffect(() => {
    const loadUserData = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      const res = await fetch("http://localhost:5005/users");
      const users = await res.json();

      const user = users.find((u: any) => u.username === username);
      if (!user) return;

      setUserId(user.id);
      setCart(user.cart || []);
      setFavorites(user.favorites || []);
    };

    loadUserData();
  }, []);

  /* =======================
     SYNC CART
  ======================= */
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5005/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });
  }, [cart, userId]);

  /* =======================
     SYNC FAVORITES
  ======================= */
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5005/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorites }),
    });
  }, [favorites, userId]);

  /* =======================
     FINALIZE ORDER
  ======================= */
  const finalizeOrder = async (paymentData: PaymentData) => {
    if (!userId) return;

    const res = await fetch(`http://localhost:5005/users/${userId}`);
    const user = await res.json();

    const updatedOrders = [...(user.orders || []), paymentData];

    await fetch(`http://localhost:5005/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orders: updatedOrders,
        cart: [],
      }),
    });

    setCart([]);
  };

  /* =======================
     CART ACTIONS
  ======================= */
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* =======================
     FAVORITES ACTIONS
  ======================= */
  const addToFavorites = (product: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        favorites,

        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,

        addToFavorites,
        removeFromFavorites,

        finalizeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* =======================
   HOOK
======================= */
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
