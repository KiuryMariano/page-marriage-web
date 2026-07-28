import { useState, useEffect, useCallback } from "react";
import { type Gift } from "../mocks";

interface CartItem extends Gift {
  quantity: number;
}

export const CART_STORAGE_KEY = "casamento_cart";

const safeParse = (raw: string | null): CartItem[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem =>
      item && typeof item === "object" && typeof item.id === "number" && typeof item.quantity === "number"
    );
  } catch {
    return [];
  }
};

export const useCartPersist = () => {
  const [cart, setCart] = useState<CartItem[]>(() => safeParse(localStorage.getItem(CART_STORAGE_KEY)));

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // localStorage cheio ou indisponível — silencioso
    }
  }, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // já está vazio no state, localStorage eventualmente sincroniza
    }
  }, []);

  return { cart, setCart, clearCart };
};

export type { CartItem };
