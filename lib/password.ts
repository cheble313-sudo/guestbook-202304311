import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { LIMITS } from "./entry.ts";

// 저장 형식: "<솔트 hex>:<해시 hex>"
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  // 아주 긴 입력으로 scrypt 연산을 오래 붙잡지 못하게 막는다
  if (password.length > LIMITS.password.max) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
