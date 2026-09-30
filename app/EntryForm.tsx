"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LIMITS } from "@/lib/entry";
import { inputClass } from "./styles";

export default function EntryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message, password }),
    });
    setPending(false);
    if (!res.ok) return setError((await res.json()).error);
    setMessage("");
    setPassword("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-2 rounded-lg border p-4">
      <div className="flex gap-2">
        <input className={inputClass} placeholder="이름" maxLength={LIMITS.name.max} value={name} onChange={(e) => setName(e.target.value)} />
        <input className={inputClass} type="password" placeholder="비밀번호 (수정·삭제용)" maxLength={LIMITS.password.max} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <textarea className={inputClass} rows={3} placeholder="메시지" maxLength={LIMITS.message.max} value={message} onChange={(e) => setMessage(e.target.value)} />
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button type="submit" disabled={pending} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
        남기기
      </button>
    </form>
  );
}
