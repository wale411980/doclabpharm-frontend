import { ChevronDown } from "lucide-react";
import { JsonLd } from "./ui";

type Item = { q: string; a: string };

/** Accessible accordion using native <details>, plus FAQPage structured data. */
export function Faq({ items }: { items: readonly Item[] }) {
  return (
    <>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-3xl bg-white p-1 ring-1 ring-brand-100 open:ring-brand-300"
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-[22px] px-5 py-4 text-left text-lg font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown
                className="h-5 w-5 flex-none text-brand-600 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-ink-500">{item.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </>
  );
}
