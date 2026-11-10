import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui";

/** Previous / next pagination for a Laravel paginator. */
export function Pagination({
  page,
  lastPage,
  total,
  onChange,
}: {
  page: number;
  lastPage: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (lastPage <= 1) return <p className="text-sm text-ink-500">{total} in total</p>;
  return (
    <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-500">
        Page {page} of {lastPage} · {total} in total
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>
        <Button variant="secondary" onClick={() => onChange(page + 1)} disabled={page >= lastPage}>
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
