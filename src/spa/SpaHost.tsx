"use client";

import dynamic from "next/dynamic";

// Browser-only: the dashboards read localStorage and window on load.
const SpaApp = dynamic(() => import("./SpaApp"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#E6F2EF] border-t-[#2E9063]" />
    </div>
  ),
});

export default function SpaHost() {
  return <SpaApp />;
}
