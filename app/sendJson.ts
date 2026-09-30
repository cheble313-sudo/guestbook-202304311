// API 요청을 보내고, 실패하면 화면에 보여 줄 안내 문구를, 성공하면 null을 돌려준다
export async function sendJson(url: string, method: string, body: unknown): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return null;
    const data = await res.json().catch(() => null);
    return data?.error ?? "요청을 처리하지 못했습니다. 잠시 후 다시 시도하세요.";
  } catch {
    return "네트워크 오류가 발생했습니다. 다시 시도하세요.";
  }
}
