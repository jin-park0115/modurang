import type { Category, Menu, Order } from '@/lib/types';

export const categories: Category[] = [
  { id: 'cat-1', name: '국밥류', order: 1 },
  { id: 'cat-2', name: '전골류', order: 2 },
  { id: 'cat-3', name: '단품/추가', order: 3 },
];

export const menus: Menu[] = [
  // 국밥류
  {
    id: 'menu-1',
    name: '순대국',
    price: 9000,
    description: '진한 국물의 순대국밥',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [
      {
        id: 'og-1',
        name: '맵기 선택',
        required: true,
        maxSelect: 1,
        items: [
          { id: 'oi-1', name: '순한맛', extraPrice: 0 },
          { id: 'oi-2', name: '보통맛', extraPrice: 0 },
          { id: 'oi-3', name: '매운맛', extraPrice: 0 },
        ],
      },
      {
        id: 'og-2',
        name: '사리 추가',
        required: false,
        maxSelect: 3,
        items: [
          { id: 'oi-4', name: '면사리', extraPrice: 1000 },
          { id: 'oi-5', name: '우동사리', extraPrice: 1000 },
          { id: 'oi-6', name: '당면사리', extraPrice: 1000 },
        ],
      },
    ],
  },
  {
    id: 'menu-2',
    name: '뼈해장국',
    price: 11000,
    description: '뼈를 우려낸 진한 해장국',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [
      {
        id: 'og-1',
        name: '맵기 선택',
        required: true,
        maxSelect: 1,
        items: [
          { id: 'oi-1', name: '순한맛', extraPrice: 0 },
          { id: 'oi-2', name: '보통맛', extraPrice: 0 },
          { id: 'oi-3', name: '매운맛', extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: 'menu-3',
    name: '뼈해장국 특',
    price: 13000,
    description: '뼈를 듬뿍 넣은 특 해장국',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [
      {
        id: 'og-1',
        name: '맵기 선택',
        required: true,
        maxSelect: 1,
        items: [
          { id: 'oi-1', name: '순한맛', extraPrice: 0 },
          { id: 'oi-2', name: '보통맛', extraPrice: 0 },
          { id: 'oi-3', name: '매운맛', extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: 'menu-4',
    name: '선지해장국',
    price: 10000,
    description: '선지가 가득한 해장국',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [
      {
        id: 'og-1',
        name: '맵기 선택',
        required: true,
        maxSelect: 1,
        items: [
          { id: 'oi-1', name: '순한맛', extraPrice: 0 },
          { id: 'oi-2', name: '보통맛', extraPrice: 0 },
          { id: 'oi-3', name: '매운맛', extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: 'menu-5',
    name: '육개장',
    price: 10000,
    description: '얼큰한 육개장',
    categoryId: 'cat-1',
    isAvailable: true,
    optionGroups: [
      {
        id: 'og-1',
        name: '맵기 선택',
        required: true,
        maxSelect: 1,
        items: [
          { id: 'oi-1', name: '순한맛', extraPrice: 0 },
          { id: 'oi-2', name: '보통맛', extraPrice: 0 },
          { id: 'oi-3', name: '매운맛', extraPrice: 0 },
        ],
      },
    ],
  },
  // 전골류
  {
    id: 'menu-6',
    name: '순대곱창전골 중',
    price: 38000,
    description: '순대와 곱창이 가득한 전골 (2~3인)',
    categoryId: 'cat-2',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-7',
    name: '순대곱창전골 대',
    price: 40000,
    description: '순대와 곱창이 가득한 전골 (3~4인)',
    categoryId: 'cat-2',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-8',
    name: '뼈다귀 감자탕 중',
    price: 40000,
    description: '뼈다귀와 감자가 어우러진 전골 (2~3인)',
    categoryId: 'cat-2',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-9',
    name: '뼈다귀 감자탕 대',
    price: 45000,
    description: '뼈다귀와 감자가 어우러진 전골 (3~4인)',
    categoryId: 'cat-2',
    isAvailable: true,
    optionGroups: [],
  },
  // 단품/추가
  {
    id: 'menu-10',
    name: '순대볶음 중',
    price: 30000,
    description: '쫄깃한 순대볶음 (2인)',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [
      {
        id: 'og-spicy',
        name: '맵기 선택',
        required: true,
        maxSelect: 1,
        items: [
          { id: 'oi-s1', name: '순한맛', extraPrice: 0 },
          { id: 'oi-s2', name: '보통맛', extraPrice: 0 },
          { id: 'oi-s3', name: '매운맛', extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: 'menu-11',
    name: '순대볶음 대',
    price: 35000,
    description: '쫄깃한 순대볶음 (3인)',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [
      {
        id: 'og-spicy',
        name: '맵기 선택',
        required: true,
        maxSelect: 1,
        items: [
          { id: 'oi-s1', name: '순한맛', extraPrice: 0 },
          { id: 'oi-s2', name: '보통맛', extraPrice: 0 },
          { id: 'oi-s3', name: '매운맛', extraPrice: 0 },
        ],
      },
    ],
  },
  {
    id: 'menu-12',
    name: '뼈 닭발',
    price: 20000,
    description: '얼큰한 뼈 닭발',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-13',
    name: '무뼈 닭발',
    price: 25000,
    description: '먹기 편한 무뼈 닭발',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-14',
    name: '돼지껍데기',
    price: 20000,
    description: '쫄깃한 돼지껍데기',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [],
  },
  {
    id: 'menu-15',
    name: '뼈 추가',
    price: 15000,
    description: '뼈 추가 주문',
    categoryId: 'cat-3',
    isAvailable: true,
    optionGroups: [],
  },
];

export const orders: Map<string, Order> = new Map();
