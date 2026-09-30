import { neon } from "@neondatabase/serverless";
import type { NewEntry } from "./entry.ts";
import { hashPassword, verifyPassword } from "./password.ts";

const sql = neon(process.env.DATABASE_URL!);

export type Entry = {
  id: number;
  name: string;
  message: string;
  createdAt: string;
  updatedAt: string | null;
};

type Row = Record<string, unknown>;

function toEntry(r: Row): Entry {
  return {
    id: r.id as number,
    name: r.name as string,
    message: r.message as string,
    createdAt: new Date(r.created_at as string).toISOString(),
    updatedAt: r.updated_at ? new Date(r.updated_at as string).toISOString() : null,
  };
}

export async function listEntries(): Promise<Entry[]> {
  const rows = await sql`
    select id, name, message, created_at, updated_at
    from entries order by created_at desc, id desc`;
  return rows.map(toEntry);
}

export async function createEntry(entry: NewEntry): Promise<Entry> {
  const [row] = await sql`
    insert into entries (name, message, password_hash)
    values (${entry.name}, ${entry.message}, ${hashPassword(entry.password)})
    returning id, name, message, created_at, updated_at`;
  return toEntry(row);
}

export type OwnerCheck = "ok" | "not_found" | "wrong_password";

async function checkOwner(id: number, password: string): Promise<OwnerCheck> {
  const [row] = await sql`select password_hash from entries where id = ${id}`;
  if (!row) return "not_found";
  return verifyPassword(password, row.password_hash as string) ? "ok" : "wrong_password";
}

export async function updateMessage(id: number, password: string, message: string): Promise<OwnerCheck> {
  const check = await checkOwner(id, password);
  if (check === "ok") await sql`update entries set message = ${message}, updated_at = now() where id = ${id}`;
  return check;
}

export async function deleteEntry(id: number, password: string): Promise<OwnerCheck> {
  const check = await checkOwner(id, password);
  if (check === "ok") await sql`delete from entries where id = ${id}`;
  return check;
}
