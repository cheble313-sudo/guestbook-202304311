// 본문이 없거나 깨졌거나 객체가 아니면(null, 숫자 등) 빈 객체로 취급한다
export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const body: unknown = await request.json().catch(() => null);
  return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
}
