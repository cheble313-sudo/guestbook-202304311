import { createEntry, listEntries } from "@/lib/db";
import { parseNewEntry } from "@/lib/entry";
import { readJsonBody } from "./readJsonBody";

export async function GET() {
  return Response.json(await listEntries());
}

export async function POST(request: Request) {
  const parsed = parseNewEntry(await readJsonBody(request));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  return Response.json(await createEntry(parsed.entry), { status: 201 });
}
