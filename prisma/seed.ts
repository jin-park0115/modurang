import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../lib/generated/prisma/client';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const db = new PrismaClient({ adapter } as never);

const SPICY_ITEMS = [
  { name: '순한맛', extraPrice: 0 },
  { name: '보통맛', extraPrice: 0 },
  { name: '매운맛', extraPrice: 0 },
];

async function addSpicy(menuId: string) {
  const group = await db.optionGroup.create({
    data: { menuId, name: '맵기 선택', required: true, maxSelect: 1 },
  });
  await db.optionItem.createMany({
    data: SPICY_ITEMS.map((i) => ({ ...i, optionGroupId: group.id })),
  });
}

async function addBoneExtra(menuId: string) {
  const group = await db.optionGroup.create({
    data: { menuId, name: '뼈 추가', required: false, maxSelect: 1 },
  });
  await db.optionItem.create({
    data: { optionGroupId: group.id, name: '뼈 추가', extraPrice: 15000 },
  });
}

async function main() {
  // ── 카테고리 ──────────────────────────────────────
  const cat1 = await db.category.create({ data: { name: '국밥류', order: 1 } });
  const cat2 = await db.category.create({ data: { name: '전골류', order: 2 } });
  const cat3 = await db.category.create({ data: { name: '단품/추가', order: 3 } });
  const cat4 = await db.category.create({ data: { name: '음료/주류', order: 4 } });

  // ── 국밥류 ────────────────────────────────────────
  // 순대국 — 옵션 없음
  await db.menu.create({
    data: { name: '순대국', price: 9000, categoryId: cat1.id, isAvailable: true },
  });

  // 뼈해장국 — 맵기 선택(필수) + 뼈 추가(선택)
  const byeHaejang = await db.menu.create({
    data: { name: '뼈해장국', price: 11000, categoryId: cat1.id, isAvailable: true },
  });
  await addSpicy(byeHaejang.id);
  await addBoneExtra(byeHaejang.id);

  // 뼈해장국 특 — 맵기 선택(필수) + 뼈 추가(선택)
  const byeSpecial = await db.menu.create({
    data: { name: '뼈해장국 특', price: 13000, categoryId: cat1.id, isAvailable: true },
  });
  await addSpicy(byeSpecial.id);
  await addBoneExtra(byeSpecial.id);

  // 선지해장국 — 맵기 선택(필수)
  const seonji = await db.menu.create({
    data: { name: '선지해장국', price: 10000, categoryId: cat1.id, isAvailable: true },
  });
  await addSpicy(seonji.id);

  // 육개장 — 맵기 선택(필수)
  const yukgae = await db.menu.create({
    data: { name: '육개장', price: 10000, categoryId: cat1.id, isAvailable: true },
  });
  await addSpicy(yukgae.id);

  // ── 전골류 ────────────────────────────────────────
  // 순대곱창전골 — 크기 선택(필수)
  const gopchang = await db.menu.create({
    data: { name: '순대곱창전골', price: 38000, categoryId: cat2.id, isAvailable: true },
  });
  const gopchangSize = await db.optionGroup.create({
    data: { menuId: gopchang.id, name: '크기 선택', required: true, maxSelect: 1 },
  });
  await db.optionItem.createMany({
    data: [
      { optionGroupId: gopchangSize.id, name: '중 (2~3인)', extraPrice: 0 },
      { optionGroupId: gopchangSize.id, name: '대 (3~4인)', extraPrice: 2000 },
    ],
  });

  // 뼈다귀 감자탕 — 크기 선택(필수) + 뼈 추가(선택)
  const gamjatang = await db.menu.create({
    data: { name: '뼈다귀 감자탕', price: 40000, categoryId: cat2.id, isAvailable: true },
  });
  const gamjatangSize = await db.optionGroup.create({
    data: { menuId: gamjatang.id, name: '크기 선택', required: true, maxSelect: 1 },
  });
  await db.optionItem.createMany({
    data: [
      { optionGroupId: gamjatangSize.id, name: '중 (2~3인)', extraPrice: 0 },
      { optionGroupId: gamjatangSize.id, name: '대 (3~4인)', extraPrice: 5000 },
    ],
  });
  await addBoneExtra(gamjatang.id);

  // ── 단품/추가 ─────────────────────────────────────
  // 순대볶음 — 맵기 선택(필수)
  const bokeum1 = await db.menu.create({
    data: { name: '순대볶음 중', price: 30000, categoryId: cat3.id, isAvailable: true },
  });
  await addSpicy(bokeum1.id);

  const bokeum2 = await db.menu.create({
    data: { name: '순대볶음 대', price: 35000, categoryId: cat3.id, isAvailable: true },
  });
  await addSpicy(bokeum2.id);

  // 단품 (옵션 없음)
  const singles = [
    { name: '뼈 닭발', price: 20000 },
    { name: '무뼈 닭발', price: 25000 },
    { name: '돼지껍데기', price: 20000 },
  ];
  for (const s of singles) {
    await db.menu.create({ data: { ...s, categoryId: cat3.id, isAvailable: true } });
  }

  // ── 음료/주류 ─────────────────────────────────────
  const drinks = [
    { name: '콜라', price: 2000 },
    { name: '사이다', price: 2000 },
    { name: '소주', price: 5000 },
    { name: '맥주', price: 5000 },
    { name: '막걸리', price: 6000 },
  ];
  for (const d of drinks) {
    await db.menu.create({ data: { ...d, categoryId: cat4.id, isAvailable: true } });
  }

  console.log('✅ Seed 완료');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
