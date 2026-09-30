import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseEntryId, parseMessage, parseNewEntry } from "./entry.ts";
import { hashPassword, verifyPassword } from "./password.ts";

describe("parseNewEntry", () => {
  it("이름과 메시지의 앞뒤 공백을 지운다", () => {
    assert.deepEqual(parseNewEntry({ name: " 은빛 ", message: " 안녕 ", password: "1234" }), {
      ok: true,
      entry: { name: "은빛", message: "안녕", password: "1234" },
    });
  });

  it("이름이 비면 거부", () => {
    assert.equal(parseNewEntry({ name: " ", message: "m", password: "1234" }).ok, false);
  });

  it("이름이 20자를 넘으면 거부", () => {
    assert.equal(parseNewEntry({ name: "가".repeat(21), message: "m", password: "1234" }).ok, false);
  });

  it("비밀번호가 4자 미만이면 거부", () => {
    assert.equal(parseNewEntry({ name: "n", message: "m", password: "123" }).ok, false);
  });

  it("문자열이 아닌 값은 거부", () => {
    assert.equal(parseNewEntry({ name: 1, message: "m", password: "1234" }).ok, false);
  });
});

describe("parseMessage", () => {
  it("빈 메시지는 거부", () => {
    assert.equal(parseMessage("   ").ok, false);
  });

  it("500자를 넘으면 거부", () => {
    assert.equal(parseMessage("a".repeat(501)).ok, false);
  });

  it("정상 메시지는 공백을 지워 돌려준다", () => {
    assert.deepEqual(parseMessage(" 수정 "), { ok: true, message: "수정" });
  });
});

describe("parseEntryId", () => {
  it("양의 정수 문자열은 숫자로 바꾼다", () => {
    assert.equal(parseEntryId("12"), 12);
  });

  it("숫자가 아니거나 범위를 벗어나면 null", () => {
    for (const raw of ["abc", "0", "-1", "1.5", "", "99999999999"]) assert.equal(parseEntryId(raw), null, raw);
  });
});

describe("password", () => {
  it("맞는 비밀번호는 통과, 틀린 비밀번호는 거부", () => {
    const hash = hashPassword("secret");
    assert.notEqual(hash, "secret");
    assert.equal(verifyPassword("secret", hash), true);
    assert.equal(verifyPassword("wrong", hash), false);
  });

  it("같은 비밀번호도 매번 다른 해시가 된다", () => {
    assert.notEqual(hashPassword("secret"), hashPassword("secret"));
  });

  it("너무 긴 비밀번호는 해시 계산 없이 거부", () => {
    assert.equal(verifyPassword("a".repeat(51), hashPassword("secret")), false);
  });

  it("형식이 깨진 해시는 거부", () => {
    assert.equal(verifyPassword("secret", "garbage"), false);
  });
});
