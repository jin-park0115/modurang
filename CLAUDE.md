# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

순대국 브랜드 전용 고객 주문 플랫폼 MVP. **풀스택 Next.js** — 프론트엔드와 백엔드(API Routes + Prisma)가 하나의 프로젝트.

## Commands

```bash
npm run dev          # 개발 서버 시작 (localhost:3000)
npm run build        # 프로덕션 빌드 + TypeScript 체크
npm run db:seed      # DB 초기 데이터 삽입 (최초 1회)
npm run db:studio    # Prisma Studio로 DB 조회
```

DB 마이그레이션:
```bash
npx prisma migrate dev --name <변경내용>   # 스키마 변경 시
npx prisma generate                        # 클라이언트 재생성
```

## Tech Stack

- **프레임워크**: Next.js 16 App Router + TypeScript
- **스타일**: Tailwind CSS + shadcn/ui
- **카트 상태**: Zustand (`lib/store.ts`) — `skipHydration: true` + `CartHydrator` 컴포넌트로 클라이언트 수동 hydrate
- **ORM**: Prisma 7 + SQLite (`dev.db`)
- **DB 어댑터**: `@prisma/adapter-libsql` (Prisma 7 SQLite 필수)
- **폼**: react-hook-form + zod

## Key Files

| 파일 | 역할 |
|------|------|
| `lib/db.ts` | Prisma 클라이언트 싱글턴 (libsql 어댑터 포함) |
| `lib/types.ts` | 공유 TypeScript 인터페이스 |
| `lib/api.ts` | 프론트 → API Route 호출 함수 모음 |
| `lib/store.ts` | Zustand 카트 스토어 |
| `prisma/schema.prisma` | DB 스키마 (Category, Menu, OptionGroup, OptionItem, Order, OrderItem, OrderItemOption) |
| `prisma/seed.ts` | 초기 메뉴 데이터 시드 |

## API Routes

```
GET  /api/categories          카테고리 목록
GET  /api/menus?categoryId=   메뉴 목록 (optionGroups 미포함)
GET  /api/menus/:id           메뉴 상세 (optionGroups 포함)
POST /api/orders              주문 생성 (총금액 서버 계산)
GET  /api/orders/:id          주문 상태 조회
PATCH /api/orders/:id         주문 상태 변경 (테스트/어드민용)
```

## Route Structure

```
/                  메뉴 목록 (카테고리 탭)
/menu/[id]         메뉴 상세 + 옵션 선택 + 카트 담기
/cart              카트 확인 + 수량 조정
/checkout          픽업/배달 선택, 연락처, 주문 제출
/order/[id]        주문 상태 추적 (5초 폴링)
```

## DB 설정 주의

- Prisma 7은 schema.prisma에 `url`을 쓸 수 없고, `prisma.config.ts`에서 관리
- `dev.db`는 프로젝트 **루트**에 위치 (`DATABASE_URL="file:./dev.db"`)
- `lib/db.ts`의 `PrismaLibSql` 어댑터는 `file:./dev.db`로 연결

## 주문 상태 변경 (테스트)

어드민 UI 없이 상태 테스트:
```bash
curl -X PATCH http://localhost:3000/api/orders/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"PREPARING"}'
```

상태 순서: `PENDING → CONFIRMED → PREPARING → READY → COMPLETED`
