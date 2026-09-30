# Spec: 미니 방명록

용어는 `CONTEXT.md`를 따른다.

## 요구사항
1. **작성**: 누구나 이름, 메시지, 글 비밀번호를 입력해 새 글을 남긴다.
2. **조회**: 누구나 전체 글 목록을 본다. 최신 작성 순.
3. **수정**: 글 비밀번호가 맞으면 메시지를 수정한다. 틀리면 거부하고 화면에 안내한다.
4. **삭제**: 글 비밀번호가 맞으면 글을 삭제한다. 틀리면 거부하고 화면에 안내한다.
5. **개발자 표시**: 모든 화면 헤더에 "개발자: 조은빛 (202304311)".

## 결정
- 스택: Next.js 16 App Router + TypeScript + Route Handlers + Neon Postgres
- 입력 제한: 이름 1~20자, 메시지 1~500자, 비밀번호 4~50자. 앞뒤 공백 제거(비밀번호 제외)
- 비밀번호는 scrypt + 솔트로 해시해 저장. 평문은 저장하지 않고 API 응답에도 넣지 않음
- 수정 가능한 것은 메시지뿐. 수정된 글은 "(수정됨)" 표시
- 작성 시간은 한국 시간으로 표시

## 데이터
`entries(id, name, message, password_hash, created_at, updated_at nullable)`

## API
| 메서드 | 경로 | 본문 | 응답 |
|---|---|---|---|
| GET | `/api/entries` | - | 200 글 목록(최신순) |
| POST | `/api/entries` | `{name, message, password}` | 201 / 400 |
| PATCH | `/api/entries/[id]` | `{password, message}` | 200 / 400 / 403 비밀번호 불일치 / 404 |
| DELETE | `/api/entries/[id]` | `{password}` | 200 / 403 비밀번호 불일치 / 404 |

## 범위 밖
로그인, 관리자 기능, 페이지 나누기
