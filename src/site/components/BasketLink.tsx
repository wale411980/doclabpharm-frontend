"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { onBasketChange, readBasket } from "@/site/basket";

/** Shows in the header once a visitor has picked a test. */
export function BasketLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readBasket().length);
    sync();
    return onBasketChange(sync);
  }, []);

  if (count === 0) return null;

  return (
    <Link
      href="/checkout"
      aria-label={`Your tests: ${count}`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-brand-200 hover:bg-brand-50"
    >
      <ShoppingBag className="h-5 w-5 text-ink-900" aria-hidden="true" />
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1 text-xs font-extrabold text-night ring-2 ring-white">
        {count}
      </span>
    </Link>
  );
}
