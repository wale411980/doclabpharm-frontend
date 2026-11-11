import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { Button, Card, ErrorState, LoadingState, PageHeader, Pill, inputStyles } from "@/components/dashboard/ui";
import { apiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";

type TestRow = {
  id: number;
  name: string;
  category: string | null;
  price: number;
  details: string | null;
  about: string | null;
  who_for: string[];
  includes: string[];
  sample: string | null;
  preparation: string | null;
  turnaround: string | null;
};

type Explanation = { id: number | null; term: string; explanation: string };

const lines = (text: string) => text.split("\n").map((line) => line.trim()).filter(Boolean);
const label = "mb-1.5 block text-sm font-bold text-ink-900";
const area = cn(inputStyles, "h-auto min-h-24 py-3 leading-relaxed");

/**
 * Where staff write what patients read on each test page. Nothing here is
 * fixed in the code: every word shown to patients comes from what is saved.
 */
export default function TestDetailsEditor() {
  const [tab, setTab] = useState<"tests" | "items">("tests");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Test details | DocLabPharm";
  }, []);

  const tests = useQuery<{ data: TestRow[] }>({ queryKey: ["admin-test-details"], queryFn: async () => (await api.get("/admin/catalogue/tests")).data });
  const items = useQuery<{ data: Explanation[]; missing: number }>({
    queryKey: ["admin-test-explanations"],
    queryFn: async () => (await api.get("/admin/catalogue/explanations")).data,
  });

  const fill = useMutation<{ message: string }>({
    mutationFn: async () => (await api.post("/admin/catalogue/fill-missing")).data,
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["admin-test-details"] });
      queryClient.invalidateQueries({ queryKey: ["admin-test-explanations"] });
    },
    onError: (e) => toast.error(apiErrorMessage(e, "We could not add the starter wording.")),
  });

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (tests.data?.data ?? []).filter((test) => !term || test.name.toLowerCase().includes(term) || (test.category ?? "").toLowerCase().includes(term));
  }, [tests.data, search]);

  const unwritten = (tests.data?.data ?? []).filter((test) => !test.about).length;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-1 py-2 sm:py-4">
      <PageHeader
        title="Test details"
        intro="What patients read about each test. Write it the way you would explain it to someone who has never heard of the test. Changes show on the website straight away."
        actions={
          <Button variant="secondary" onClick={() => fill.mutate()} loading={fill.isPending}>
            Add starter wording where empty
          </Button>
        }
      />

      <div role="tablist" className="flex gap-2">
        {(
          [
            ["tests", `Tests${unwritten ? ` (${unwritten} need wording)` : ""}`],
            ["items", `Items inside tests${items.data?.missing ? ` (${items.data.missing} need wording)` : ""}`],
          ] as const
        ).map(([key, text]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn("min-h-11 rounded-full px-5 text-[15px] font-bold ring-1 ring-inset", tab === key ? "bg-brand-700 text-white ring-brand-700" : "bg-white text-ink-700 ring-brand-200")}
          >
            {text}
          </button>
        ))}
      </div>

      {tab === "tests" && (
        <>
          <input className={inputStyles} placeholder="Search a test by name or category" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search tests" />
          {tests.isLoading && <LoadingState label="Loading tests" />}
          {tests.isError && <ErrorState message={apiErrorMessage(tests.error, "We could not load the tests.")} onRetry={() => tests.refetch()} />}
          <ul className="flex flex-col gap-3">
            {shown.map((test) => (
              <li key={test.id}>
                <Card className="flex flex-col gap-4">
                  <button type="button" onClick={() => setOpenId(openId === test.id ? null : test.id)} aria-expanded={openId === test.id} className="flex w-full items-center justify-between gap-3 text-left">
                    <span>
                      <span className="block text-lg font-extrabold text-ink-900">{test.name}</span>
                      <span className="block text-sm text-ink-500">
                        {test.category ?? "No category"} · ₦{Math.round(test.price).toLocaleString("en-NG")}
                      </span>
                    </span>
                    {test.about ? <Pill tone="brand">Written</Pill> : <Pill tone="warm">Needs wording</Pill>}
                  </button>
                  {openId === test.id && <TestForm test={test} />}
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "items" && (
        <>
          <p className="text-[15px] text-ink-700">
            Each item below appears inside one or more tests. Its explanation is shown under the item on every test page that includes it. Leave an
            explanation empty and save to remove it.
          </p>
          {items.isLoading && <LoadingState label="Loading items" />}
          {items.isError && <ErrorState message={apiErrorMessage(items.error, "We could not load the items.")} onRetry={() => items.refetch()} />}
          <ul className="flex flex-col gap-3">
            {(items.data?.data ?? []).map((item) => (
              <li key={item.term}>
                <ItemForm item={item} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function TestForm({ test }: { test: TestRow }) {
  const queryClient = useQueryClient();
  const [details, setDetails] = useState(test.details ?? "");
  const [about, setAbout] = useState(test.about ?? "");
  const [whoFor, setWhoFor] = useState(test.who_for.join("\n"));
  const [includes, setIncludes] = useState(test.includes.join("\n"));
  const [sample, setSample] = useState(test.sample ?? "");
  const [preparation, setPreparation] = useState(test.preparation ?? "");
  const [turnaround, setTurnaround] = useState(test.turnaround ?? "");

  const save = useMutation<{ message: string }>({
    mutationFn: async () =>
      (
        await api.put(`/admin/catalogue/tests/${test.id}`, {
          details: details.trim() || null,
          about: about.trim() || null,
          who_for: lines(whoFor),
          includes: lines(includes),
          sample: sample.trim() || null,
          preparation: preparation.trim() || null,
          turnaround: turnaround.trim() || null,
        })
      ).data,
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["admin-test-details"] });
      queryClient.invalidateQueries({ queryKey: ["admin-test-explanations"] });
    },
    onError: (e) => toast.error(apiErrorMessage(e, "We could not save. Please try again.")),
  });

  const id = `test-${test.id}`;

  return (
    <form
      className="flex flex-col gap-4 border-t border-brand-100 pt-4"
      onSubmit={(event) => {
        event.preventDefault();
        save.mutate();
      }}
    >
      <label htmlFor={`${id}-details`}>
        <span className={label}>One-line summary (shown on the test card)</span>
        <input id={`${id}-details`} className={inputStyles} value={details} maxLength={300} onChange={(e) => setDetails(e.target.value)} />
      </label>
      <label htmlFor={`${id}-about`}>
        <span className={label}>What this test is (2 or 3 plain sentences)</span>
        <textarea id={`${id}-about`} className={area} value={about} maxLength={3000} onChange={(e) => setAbout(e.target.value)} />
      </label>
      <label htmlFor={`${id}-who`}>
        <span className={label}>Who should take it (one per line)</span>
        <textarea id={`${id}-who`} className={area} value={whoFor} onChange={(e) => setWhoFor(e.target.value)} />
      </label>
      <label htmlFor={`${id}-includes`}>
        <span className={label}>What is inside (one item per line). Explain each item under "Items inside tests".</span>
        <textarea id={`${id}-includes`} className={area} value={includes} onChange={(e) => setIncludes(e.target.value)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor={`${id}-sample`}>
          <span className={label}>Sample taken</span>
          <input id={`${id}-sample`} className={inputStyles} value={sample} placeholder="Blood, urine, swab" onChange={(e) => setSample(e.target.value)} />
        </label>
        <label htmlFor={`${id}-turnaround`}>
          <span className={label}>When the result is ready</span>
          <input id={`${id}-turnaround`} className={inputStyles} value={turnaround} placeholder="Within 24 hours" onChange={(e) => setTurnaround(e.target.value)} />
        </label>
      </div>
      <label htmlFor={`${id}-prep`}>
        <span className={label}>How to prepare</span>
        <input id={`${id}-prep`} className={inputStyles} value={preparation} placeholder="Do not eat for 8 hours before" onChange={(e) => setPreparation(e.target.value)} />
      </label>
      <Button type="submit" loading={save.isPending} className="self-start">
        Save
      </Button>
    </form>
  );
}

function ItemForm({ item }: { item: Explanation }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState(item.explanation);

  const save = useMutation<{ message: string }>({
    mutationFn: async () => (await api.put("/admin/catalogue/explanations", { term: item.term, explanation: text.trim() })).data,
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["admin-test-explanations"] });
    },
    onError: (e) => toast.error(apiErrorMessage(e, "We could not save. Please try again.")),
  });

  const id = `item-${item.term.replace(/\W+/g, "-")}`;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-lg font-extrabold text-ink-900">
          {item.term}
        </label>
        {!item.explanation && <Pill tone="warm">Needs wording</Pill>}
      </div>
      <textarea id={id} className={cn(area, "min-h-20")} value={text} maxLength={1000} placeholder="What does this check, in everyday words?" onChange={(e) => setText(e.target.value)} />
      <Button onClick={() => save.mutate()} loading={save.isPending} disabled={text.trim() === item.explanation.trim()} className="self-start">
        Save
      </Button>
    </Card>
  );
}
