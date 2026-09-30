# Tickets: 미니 방명록

`spec.md` 기준. 위에서부터 순서대로 구현한다.

1. **DB 스키마 + 연결** (ready-for-agent): `db/schema.sql`, `lib/db.ts`
2. **도메인 로직 (TDD)** (ready-for-agent): 입력 검증, 비밀번호 해시/검증 + 테스트
3. **작성 + 조회** (ready-for-agent): `GET/POST /api/entries`, 목록 화면, 작성 폼
4. **수정** (ready-for-agent): `PATCH /api/entries/[id]`, 비밀번호 불일치 안내
5. **삭제** (ready-for-agent): `DELETE /api/entries/[id]`, 비밀번호 불일치 안내
6. **개발자 표시** (ready-for-agent): 헤더 "개발자: 조은빛 (202304311)"
7. **배포** (ready-for-human): GitHub Push → Vercel Import → `DATABASE_URL` 설정
