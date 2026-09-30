import { createEntry, listEntries } from "@/lib/db";
import { parseNewEntry } from "@/lib/entry";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await listEntries());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = parseNewEntry(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  return Response.json(await createEntry(parsed.entry), { status: 201 });
}
