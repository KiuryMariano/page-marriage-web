import { useState, useEffect } from "react";
import { type Gift } from "../mocks";

interface CartItem extends Gift {
  quantity: number;
}

const CART_STORAGE_KEY = "casamento_cart";

export const useCartPersist = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return { cart, setCart };
};

export type { CartItem };
