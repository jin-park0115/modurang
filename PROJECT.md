# 모두랑 — 순대국 브랜드 주문 플랫폼 MVP

## 프로젝트 개요

순대국 브랜드 전용 고객 주문 웹앱. 메뉴 선택 → 옵션 선택 → 카트 → 결제(UI) → 주문 상태 추적까지 전체 주문 플로우를 담당한다.

- **아키텍처**: 풀스택 Next.js (프론트 + API Routes + DB 모두 하나의 프로젝트)
- **DB**: SQLite (개발) — 추후 PostgreSQL로 교체 가능
- **결제**: UI 구현만, 실제 PG 연동은 추후
- **어드민**: MVP 범위 외, 추후 개발

---

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.2.6 |
| 언어 | TypeScript | ^5 |
| 스타일 | Tailwind CSS + shadcn/ui | ^4 |
| ORM | Prisma | ^7.8.0 |
| DB 어댑터 | @prisma/adapter-libsql | ^7.8.0 |
| 카트 상태 | Zustand | ^5.0.13 |
| 폼 검증 | react-hook-form + zod | ^7 / ^4 |
| 아이콘 | lucide-react | ^1 |

---

## 주요 커맨드

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드 (타입 체크 포함)
npm run build

# 초기 메뉴 데이터 DB 삽입 (최초 1회)
npm run db:seed

# DB GUI 조회
npm run db:studio

# 스키마 변경 후 마이그레이션
npx prisma migrate dev --name <변경내용>

# Prisma 클라이언트 재생성
npx prisma generate
```

---

## 프로젝트 구조

```
modurang/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 공통 레이아웃 (헤더, 카트 아이콘)
│   ├── page.tsx                  # 메뉴 목록 홈
│   ├── menu/[id]/page.tsx        # 메뉴 상세 + 옵션 선택
│   ├── cart/page.tsx             # 장바구니
│   ├── checkout/page.tsx         # 결제/주문 완료
│   ├── order/[id]/page.tsx       # 주문 상태 추적
│   └── api/
│       ├── categories/route.ts   # GET /api/categories
│       ├── menus/route.ts        # GET /api/menus
│       ├── menus/[id]/route.ts   # GET /api/menus/:id
│       ├── orders/route.ts       # POST /api/orders
│       └── orders/[id]/route.ts  # GET, PATCH /api/orders/:id
│
├── components/
│   ├── CartIcon.tsx              # 헤더 카트 아이콘 + 개수 배지
│   ├── CartHydrator.tsx          # Zustand persist 클라이언트 수동 hydrate
│   ├── MenuCard.tsx              # 메뉴 목록 카드
│   ├── OrderStepper.tsx          # 주문 상태 5단계 스테퍼
│   └── ui/                       # shadcn/ui 컴포넌트
│
├── lib/
│   ├── api.ts                    # 프론트 → API 호출 함수 모음
│   ├── db.ts                     # Prisma 클라이언트 싱글턴
│   ├── store.ts                  # Zustand 카트 스토어
│   └── types.ts                  # 공유 TypeScript 인터페이스
│
├── prisma/
│   ├── schema.prisma             # DB 스키마
│   └── seed.ts                   # 초기 메뉴 데이터
│
└── mocks/                        # MSW (현재 미사용, 참고용 보존)
    ├── data.ts
    └── handlers.ts
```

---

## DB 스키마

```
Category
├── id, name, order

Menu
├── id, name, price, description, imageUrl
├── categoryId → Category
└── isAvailable

OptionGroup
├── id, name, required, maxSelect
└── menuId → Menu

OptionItem
├── id, name, extraPrice
└── optionGroupId → OptionGroup

Order
├── id, status, type(PICKUP|DELIVERY)
├── phone, address(배달 시)
├── totalPrice, estimatedMinutes
└── createdAt

OrderItem
├── id, quantity, unitPrice(주문 시점 단가 스냅샷)
├── orderId → Order
└── menuId → Menu

OrderItemOption
├── orderItemId → OrderItem
└── optionItemId → OptionItem
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/categories` | 카테고리 목록 (order 오름차순) |
| GET | `/api/menus?categoryId=` | 메뉴 목록 (optionGroups 미포함) |
| GET | `/api/menus/:id` | 메뉴 상세 (optionGroups + items 포함) |
| POST | `/api/orders` | 주문 생성 (총금액 서버에서 계산) |
| GET | `/api/orders/:id` | 주문 상태 조회 |
| PATCH | `/api/orders/:id` | 주문 상태 변경 (테스트/어드민용) |

### POST /api/orders 요청 Body

```json
{
  "type": "PICKUP",
  "phone": "01012345678",
  "address": null,
  "items": [
    {
      "menuId": "메뉴ID",
      "quantity": 2,
      "selectedOptionIds": ["옵션아이템ID1", "옵션아이템ID2"]
    }
  ]
}
```

### 주문 상태 흐름

```
PENDING → CONFIRMED → PREPARING → READY → COMPLETED
 (접수)    (확인)      (준비중)   (준비완료)  (완료)
```

---

## 페이지별 기능

### `/` — 메뉴 목록
- 카테고리 탭 (전체 / 국밥류 / 전골류 / 단품추가 / 음료주류)
- 메뉴 카드 (이름, 가격, 품절 처리)
- 카테고리 필터링

### `/menu/[id]` — 메뉴 상세
- 옵션 그룹 렌더링 (필수/선택, 단일/다중)
- 수량 선택 + 소계 실시간 계산
- 장바구니 담기 → Zustand store 저장

### `/cart` — 장바구니
- 담긴 항목 + 선택 옵션 요약
- 수량 +/- 조정, 항목 삭제
- 합계 금액 표시

### `/checkout` — 주문하기
- 픽업 / 배달 토글
- 배달 선택 시 주소 입력 노출
- 연락처 입력 (zod 검증)
- 결제 버튼 UI (카드/카카오페이 — 연동 미완)
- `POST /api/orders` 호출 → `/order/[id]` 리다이렉트

### `/order/[id]` — 주문 상태
- 5단계 스테퍼 (현재 단계 강조)
- 5초 폴링으로 상태 자동 갱신
- 픽업: "방문해 주세요" / 배달: "배달 중입니다" 분기

---

## 메뉴 구성 (시드 데이터)

### 국밥류
| 메뉴 | 가격 | 옵션 |
|------|------|------|
| 순대국 | 9,000원 | — |
| 뼈해장국 | 11,000원 | 맵기 선택(필수) + 뼈 추가(선택, +15,000) |
| 뼈해장국 특 | 13,000원 | 맵기 선택(필수) + 뼈 추가(선택, +15,000) |
| 선지해장국 | 10,000원 | 맵기 선택(필수) |
| 육개장 | 10,000원 | 맵기 선택(필수) |

### 전골류
| 메뉴 | 기본가 | 옵션 |
|------|--------|------|
| 순대곱창전골 | 38,000원 | 크기 선택(필수): 중 / 대 +2,000 |
| 뼈다귀 감자탕 | 40,000원 | 크기 선택(필수): 중 / 대 +5,000 + 뼈 추가(선택, +15,000) |

### 단품 / 추가
| 메뉴 | 가격 | 옵션 |
|------|------|------|
| 순대볶음 중 | 30,000원 | 맵기 선택(필수) |
| 순대볶음 대 | 35,000원 | 맵기 선택(필수) |
| 뼈 닭발 | 20,000원 | — |
| 무뼈 닭발 | 25,000원 | — |
| 돼지껍데기 | 20,000원 | — |

### 음료/주류
| 메뉴 | 가격 |
|------|------|
| 콜라 | 2,000원 |
| 사이다 | 2,000원 |
| 소주 | 5,000원 |
| 맥주 | 5,000원 |
| 막걸리 | 6,000원 |

---

## 주문 상태 테스트 방법

어드민 UI 없이 curl로 상태 변경 가능:

```bash
curl -X PATCH http://localhost:3000/api/orders/<주문ID> \
  -H "Content-Type: application/json" \
  -d '{"status": "PREPARING"}'
```

---

## 환경변수

| 파일 | 변수 | 설명 |
|------|------|------|
| `.env` | `DATABASE_URL=file:./dev.db` | Prisma 마이그레이션용 SQLite 경로 |
| `.env.local` | `NEXT_PUBLIC_API_BASE_URL` | 외부 백엔드 연동 시 설정 (비워두면 내부 API Routes 사용) |

---

## 향후 개발 예정

- [ ] 결제 PG 연동 (토스페이먼츠 또는 카카오페이)
- [ ] 어드민 페이지 (주문 접수, 상태 변경, 메뉴 관리)
- [ ] PostgreSQL 전환 (배포 시)
- [ ] 푸시 알림 (주문 상태 변경 시)
