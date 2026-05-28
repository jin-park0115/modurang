# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

순대국 브랜드 전용 고객 주문 플랫폼 MVP. 고객이 메뉴를 선택하고, 옵션을 고르고, 픽업/배달을 선택한 뒤 주문을 넣고 상태를 추적하는 웹앱.

**Architecture**: Next.js 14 (App Router) frontend + separate backend API (user-developed). The frontend consumes REST endpoints via `lib/api.ts` and uses MSW for local development mocking when `NEXT_PUBLIC_API_BASE_URL` is not set.

## Commands

```bash
npm run dev      # Start development server (MSW mock active by default)
npm run build    # Production build + TypeScript check
npm run start    # Start production server
```

## Tech Stack

- **Framework**: Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Cart state**: Zustand with localStorage persistence (`lib/store.ts`)
- **API client**: fetch wrapper in `lib/api.ts` (reads `NEXT_PUBLIC_API_BASE_URL`)
- **Dev mocking**: MSW — handlers in `mocks/handlers.ts`, activated by `components/MockProvider.tsx`
- **Forms**: react-hook-form + zod

## Key Files

| File | Purpose |
|------|---------|
| `lib/types.ts` | Shared TypeScript interfaces (`Menu`, `Order`, `CartItem`, etc.) |
| `lib/api.ts` | All backend API calls — single place to update when backend URL changes |
| `lib/store.ts` | Zustand cart store with `addItem`, `removeItem`, `updateQuantity`, `clearCart` |
| `mocks/data.ts` | Full menu seed data (15 items across 3 categories) |
| `mocks/handlers.ts` | MSW request handlers matching the backend API contract |

## Backend API Contract

The frontend expects these endpoints. When the backend is ready, set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` and MSW will be bypassed automatically.

```
GET  /api/categories
GET  /api/menus?categoryId=<id>
GET  /api/menus/:id
POST /api/orders          body: OrderPayload
GET  /api/orders/:id
```

Response shapes are defined in `lib/types.ts`.

## Enabling Backend Integration

1. Uncomment and set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` in `.env.local`
2. MSW will not start when this variable is present (see `MockProvider.tsx`)

## Route Structure

```
/                  메뉴 목록 (카테고리 탭)
/menu/[id]         메뉴 상세 + 옵션 선택 + 카트 담기
/cart              카트 확인 + 수량 조정
/checkout          픽업/배달 선택, 연락처, 주문 제출
/order/[id]        주문 상태 추적 (5초 폴링)
```

## Important Notes

- The checkout page (`/checkout`) uses a single zod schema for both pickup and delivery. Delivery address validation is done in `onSubmit` via `setError('address', ...)`.
- Order status polling in `/order/[id]` stops automatically when status reaches `COMPLETED`.
- Payment UI is mocked only — no real PG integration yet.
