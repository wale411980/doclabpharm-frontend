import { readFileSync } from "node:fs";
import path from "node:path";
import { Container } from "./ui";

type Block = { kind: "h1" | "h2" | "p"; text: string } | { kind: "ul"; items: string[] };

/** Parse the small Markdown subset the legal files use: #, ##, - items and paragraphs. */
function parse(markdown: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of markdown.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("## ")) blocks.push({ kind: "h2", text: line.slice(3) });
    else if (line.startsWith("# ")) blocks.push({ kind: "h1", text: line.slice(2) });
    else if (line.startsWith("- ")) {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "ul") last.items.push(line.slice(2));
      else blocks.push({ kind: "ul", items: [line.slice(2)] });
    } else blocks.push({ kind: "p", text: line });
  }
  return blocks;
}

export function loadLegal(file: "privacy.md" | "terms.md" | "refund.md"): Block[] {
  return parse(readFileSync(path.join(process.cwd(), "src/site/legal", file), "utf8"));
}

export function LegalDocument({ blocks }: { blocks: Block[] }) {
  const [first, ...rest] = blocks;
  return (
    <>
      <section className="bg-brand-50">
        <Container className="py-14 sm:py-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            {first?.kind === "h1" ? first.text : ""}
          </h1>
        </Container>
      </section>
      <Container className="py-12 sm:py-16">
        <article className="mx-auto flex max-w-3xl flex-col gap-4 text-[17px] leading-relaxed text-ink-700">
          {rest.map((block, index) => {
            if (block.kind === "h2")
              return (
                <h2 key={index} className="mt-6 text-2xl font-extrabold text-ink-900">
                  {block.text}
                </h2>
              );
            if (block.kind === "ul")
              return (
                <ul key={index} className="flex list-disc flex-col gap-2 pl-6 marker:text-brand-600">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            return <p key={index}>{block.kind === "h1" ? "" : block.text}</p>;
          })}
        </article>
      </Container>
    </>
  );
}
