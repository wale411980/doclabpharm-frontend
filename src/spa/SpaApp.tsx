"use client";

import "leaflet/dist/leaflet.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import App from "@/App";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/**
 * The signed-in dashboards (patient, doctor, pharmacy, lab, admin, super
 * admin). This is the original single-page app, mounted unchanged inside the
 * Next.js site; middleware.ts sends its URLs here.
 */
export default function SpaApp() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
