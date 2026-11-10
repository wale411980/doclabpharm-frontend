import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex min-h-11 items-center gap-2.5 rounded-lg", className)}
      aria-label="DocLabPharm home"
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          inverted ? "bg-white" : "bg-brand-50"
        )}
      >
        <Image src="/images/logo-mark.png" alt="" width={28} height={30} priority />
      </span>
      <span className={cn("text-xl font-extrabold tracking-tight", inverted ? "text-white" : "text-ink-900")}>
        DocLab<span className={inverted ? "text-brand-200" : "text-brand-600"}>Pharm</span>
      </span>
    </Link>
  );
}
