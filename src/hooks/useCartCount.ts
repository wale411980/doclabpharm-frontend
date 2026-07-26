import { useState, useEffect } from "react";

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("patient_cart") || "[]");
    setCount(cart.length);

    const handleStorage = () => {
      const updatedCart = JSON.parse(
        localStorage.getItem("patient_cart") || "[]"
      );
      setCount(updatedCart.length);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return count;
}
