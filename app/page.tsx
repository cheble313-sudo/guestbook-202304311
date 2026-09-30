import { listEntries } from "@/lib/db";
import EntryForm from "./EntryForm";
import EntryItem from "./EntryItem";

export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await listEntries();

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 p-6">
      <section>
        <h1 className="mb-4 text-2xl font-bold">미니 방명록</h1>
        <EntryForm />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">방명록 ({entries.length})</h2>
        {entries.length === 0 && <p className="text-zinc-500">첫 글을 남겨 주세요.</p>}
        <ul className="space-y-3">
          {entries.map((entry) => (
            <EntryItem key={entry.id} entry={entry} />
          ))}
        </ul>
      </section>
    </main>
  );
}
