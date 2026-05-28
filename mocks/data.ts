import type { Category, Menu, Order } from '@/lib/types';

export const categories: Category[] = [
  { id: 'cat-1', name: '국밥류', order: 1 },
  { id: 'cat-2', name: '전골류', order: 2 },
  { id: 'cat-3', name: '단품/추가', order: 3 },
  { id: 'cat-4', name: '음료/주류', order: 4 },
];

const SPICY_GROUP = (id: string) => ({
  id: `og-spicy-${id}`,
  name: '맵기 선택',
  required: true,
  maxSelect: 1,
  items: [
    { id: `oi-mild-${id}`, name: '순한맛', extraPrice: 0 },
    { id: `oi-mid-${id}`, name: '보통맛', extraPrice: 0 },
    { id: `oi-hot-${id}`, name: '매운맛', extraPrice: 0 },
  ],
});

const BONE_EXTRA_GROUP = (id: string) => ({
  id: `og-bone-${id}`,
  name: '뼈 추가',
  required: false,
  maxSelect: 1,
  items: [{ id: `oi-bone-${id}`, name: '뼈 추가', extraPrice: 15000 }],
});

export const menus: Menu[] = [
  // ── 국밥류 ──────────────────────────────────
  {
    id: 'menu-1',
    name: '순대국',
    price: 9000,
    description: '진한 국물의 순대국밥',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-2',
    name: '뼈해장국',
    price: 11000,
    description: '뼈를 우려낸 진한 해장국',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [SPICY_GROUP('m2'), BONE_EXTRA_GROUP('m2')],
  },
  {
    id: 'menu-3',
    name: '뼈해장국 특',
    price: 13000,
    description: '뼈를 듬뿍 넣은 특 해장국',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [SPICY_GROUP('m3'), BONE_EXTRA_GROUP('m3')],
  },
  {
    id: 'menu-4',
    name: '선지해장국',
    price: 10000,
    description: '선지가 가득한 해장국',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [SPICY_GROUP('m4')],
  },
  {
    id: 'menu-5',
    name: '육개장',
    price: 10000,
    description: '얼큰한 육개장',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [SPICY_GROUP('m5')],
  },

  // ── 전골류 ──────────────────────────────────
  {
    id: 'menu-6',
    name: '순대곱창전골',
    price: 38000,
    description: '순대와 곱창이 가득한 전골',
    categoryId: 'cat-2',
    isAvailable: true,
    optionGroups: [
      {
        id: 'og-size-m6',
        name: '크기 선택',
        required: true,
        maxSelect: 1,
        items: [
          { id: 'oi-mid-m6', name: '중 (2~3인)', extraPrice: 0 },
          { id: 'oi-big-m6', name: '대 (3~4인)', extraPrice: 2000 },
        ],
      },
    ],
  },
  {
    id: 'menu-7',
    name: '뼈다귀 감자탕',
    price: 40000,
    description: '뼈다귀와 감자가 어우러진 전골',
    categoryId: 'cat-2',
    isAvailable: true,
    optionGroups: [
      {
        id: 'og-size-m7',
        name: '크기 선택',
        required: true,
        maxSelect: 1,
        items: [
          { id: 'oi-mid-m7', name: '중 (2~3인)', extraPrice: 0 },
          { id: 'oi-big-m7', name: '대 (3~4인)', extraPrice: 5000 },
        ],
      },
      BONE_EXTRA_GROUP('m7'),
    ],
  },

  // ── 단품/추가 ────────────────────────────────
  {
    id: 'menu-8',
    name: '순대볶음 중',
    price: 30000,
    description: '쫄깃한 순대볶음 (2인)',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [SPICY_GROUP('m8')],
  },
  {
    id: 'menu-9',
    name: '순대볶음 대',
    price: 35000,
    description: '쫄깃한 순대볶음 (3인)',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [SPICY_GROUP('m9')],
  },
  {
    id: 'menu-10',
    name: '뼈 닭발',
    price: 20000,
    description: '얼큰한 뼈 닭발',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-11',
    name: '무뼈 닭발',
    price: 25000,
    description: '먹기 편한 무뼈 닭발',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-12',
    name: '돼지껍데기',
    price: 20000,
    description: '쫄깃한 돼지껍데기',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [],
  },

  // ── 음료/주류 ────────────────────────────────
  {
    id: 'menu-13',
    name: '콜라',
    price: 2000,
    categoryId: 'cat-4',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-14',
    name: '사이다',
    price: 2000,
    categoryId: 'cat-4',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-15',
    name: '소주',
    price: 5000,
    categoryId: 'cat-4',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-16',
    name: '맥주',
    price: 5000,
    categoryId: 'cat-4',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-17',
    name: '막걸리',
    price: 6000,
    categoryId: 'cat-4',
    isAvailable: true,
    optionGroups: [],
  },
];

export const orders: Map<string, Order> = new Map();
