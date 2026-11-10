"use client";

import { useState } from "react";
import type { CatalogueTest } from "@/site/api";
import { addToBasket } from "@/site/basket";
import { cn } from "@/lib/utils";

/** One tap from a test to checkout. No sign-in. */
export function BookButton({ test, className, children = "Book" }: { test: CatalogueTest; className?: string; children?: React.ReactNode }) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy || !test.lab}
      onClick={() => {
        setBusy(true);
        addToBasket(test);
        window.location.assign("/checkout");
      }}
      className={cn(
        "rounded-full bg-lime font-extrabold text-night transition-transform hover:bg-[#d6fa85] active:scale-[0.97] disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}
