export const LIMITS = {
  name: { min: 1, max: 20 },
  message: { min: 1, max: 500 },
  password: { min: 4, max: 50 },
} as const;

type Result<T> = ({ ok: true } & T) | { ok: false; error: string };

function checkLength(value: string, field: keyof typeof LIMITS, label: string): string | null {
  const { min, max } = LIMITS[field];
  if (value.length < min || value.length > max) return `${label}은(는) ${min}~${max}자로 입력하세요.`;
  return null;
}

export function parseMessage(input: unknown): Result<{ message: string }> {
  const message = typeof input === "string" ? input.trim() : "";
  const error = checkLength(message, "message", "메시지");
  return error ? { ok: false, error } : { ok: true, message };
}

export type NewEntry = { name: string; message: string; password: string };

export function parseNewEntry(input: {
  name?: unknown;
  message?: unknown;
  password?: unknown;
}): Result<{ entry: NewEntry }> {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const nameError = checkLength(name, "name", "이름");
  if (nameError) return { ok: false, error: nameError };

  const message = parseMessage(input.message);
  if (!message.ok) return message;

  const password = typeof input.password === "string" ? input.password : "";
  const passwordError = checkLength(password, "password", "비밀번호");
  if (passwordError) return { ok: false, error: passwordError };

  return { ok: true, entry: { name, message: message.message, password } };
}
