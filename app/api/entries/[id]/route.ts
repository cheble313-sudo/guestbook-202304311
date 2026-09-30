import { deleteEntry, updateMessage, type OwnerCheck } from "@/lib/db";
import { parseMessage } from "@/lib/entry";

function reject(check: Exclude<OwnerCheck, "ok">) {
  return check === "not_found"
    ? Response.json({ error: "글을 찾을 수 없습니다." }, { status: 404 })
    : Response.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 });
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/entries/[id]">) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const parsed = parseMessage(body.message);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const check = await updateMessage(Number(id), String(body.password ?? ""), parsed.message);
  return check === "ok" ? Response.json({ ok: true }) : reject(check);
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/entries/[id]">) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const check = await deleteEntry(Number(id), String(body.password ?? ""));
  return check === "ok" ? Response.json({ ok: true }) : reject(check);
}
