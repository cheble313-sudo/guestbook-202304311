"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Entry } from "@/lib/db";
import { LIMITS } from "@/lib/entry";
import { sendJson } from "./sendJson";
import { inputClass } from "./styles";

function formatKst(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
}

export default function EntryItem({ entry }: { entry: Entry }) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [message, setMessage] = useState(entry.message);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function open(next: "edit" | "delete") {
    setMode(next);
    setMessage(entry.message);
    setPassword("");
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const failure =
      mode === "edit"
        ? await sendJson(`/api/entries/${entry.id}`, "PATCH", { password, message })
        : await sendJson(`/api/entries/${entry.id}`, "DELETE", { password });
    setPending(false);
    if (failure) return setError(failure);
    setMode("view");
    router.refresh();
  }

  return (
    <li className="rounded-lg border p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{entry.name}</span>
        <span className="text-xs text-zinc-500">
          {formatKst(entry.createdAt)}
          {entry.updatedAt && " (수정됨)"}
        </span>
      </div>

      {mode !== "edit" && <p className="mt-2 whitespace-pre-wrap break-words">{entry.message}</p>}

      {mode === "view" ? (
        <div className="mt-2 flex gap-3 text-sm">
          <button className="text-blue-600 underline" onClick={() => open("edit")}>
            수정
          </button>
          <button className="text-red-600 underline" onClick={() => open("delete")}>
            삭제
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-2 space-y-2">
          {mode === "edit" && (
            <textarea className={inputClass} rows={3} maxLength={LIMITS.message.max} value={message} onChange={(e) => setMessage(e.target.value)} />
          )}
          <input className={inputClass} type="password" placeholder="글 비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          )}
          <div className="flex gap-2 text-sm">
            <button
              type="submit"
              disabled={pending}
              className={`rounded px-3 py-1 text-white disabled:opacity-50 ${mode === "edit" ? "bg-blue-600" : "bg-red-600"}`}
            >
              {mode === "edit" ? "수정 완료" : "삭제하기"}
            </button>
            <button type="button" className="rounded border px-3 py-1" onClick={() => setMode("view")}>
              취소
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
