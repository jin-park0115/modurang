import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../lib/generated/prisma/client';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const db = new PrismaClient({ adapter } as never);

async function main() {
  // 카테고리
  const cat1 = await db.category.create({ data: { name: '국밥류', order: 1 } });
  const cat2 = await db.category.create({ data: { name: '전골류', order: 2 } });
  const cat3 = await db.category.create({ data: { name: '단품/추가', order: 3 } });

  // 국밥류 — 맵기 옵션 재사용 헬퍼
  async function createGukbap(name: string, price: number, categoryId: string, hasSari = false) {
    const menu = await db.menu.create({
      data: { name, price, categoryId, isAvailable: true },
    });
    const spicy = await db.optionGroup.create({
      data: { menuId: menu.id, name: '맵기 선택', required: true, maxSelect: 1 },
    });
    await db.optionItem.createMany({
      data: [
        { optionGroupId: spicy.id, name: '순한맛', extraPrice: 0 },
        { optionGroupId: spicy.id, name: '보통맛', extraPrice: 0 },
        { optionGroupId: spicy.id, name: '매운맛', extraPrice: 0 },
      ],
    });
    if (hasSari) {
      const sari = await db.optionGroup.create({
        data: { menuId: menu.id, name: '사리 추가', required: false, maxSelect: 3 },
      });
      await db.optionItem.createMany({
        data: [
          { optionGroupId: sari.id, name: '면사리', extraPrice: 1000 },
          { optionGroupId: sari.id, name: '우동사리', extraPrice: 1000 },
          { optionGroupId: sari.id, name: '당면사리', extraPrice: 1000 },
        ],
      });
    }
  }

  await createGukbap('순대국', 9000, cat1.id, true);
  await createGukbap('뼈해장국', 11000, cat1.id);
  await createGukbap('뼈해장국 특', 13000, cat1.id);
  await createGukbap('선지해장국', 10000, cat1.id);
  await createGukbap('육개장', 10000, cat1.id);

  // 전골류 — 옵션 없음
  const jungols = [
    { name: '순대곱창전골 중', price: 38000 },
    { name: '순대곱창전골 대', price: 40000 },
    { name: '뼈다귀 감자탕 중', price: 40000 },
    { name: '뼈다귀 감자탕 대', price: 45000 },
  ];
  for (const j of jungols) {
    await db.menu.create({ data: { ...j, categoryId: cat2.id, isAvailable: true } });
  }

  // 단품/추가 — 볶음은 맵기 옵션 있음
  async function createBokeum(name: string, price: number) {
    const menu = await db.menu.create({ data: { name, price, categoryId: cat3.id, isAvailable: true } });
    const spicy = await db.optionGroup.create({
      data: { menuId: menu.id, name: '맵기 선택', required: true, maxSelect: 1 },
    });
    await db.optionItem.createMany({
      data: [
        { optionGroupId: spicy.id, name: '순한맛', extraPrice: 0 },
        { optionGroupId: spicy.id, name: '보통맛', extraPrice: 0 },
        { optionGroupId: spicy.id, name: '매운맛', extraPrice: 0 },
      ],
    });
  }

  await createBokeum('순대볶음 중', 30000);
  await createBokeum('순대볶음 대', 35000);

  const singles = [
    { name: '뼈 닭발', price: 20000 },
    { name: '무뼈 닭발', price: 25000 },
    { name: '돼지껍데기', price: 20000 },
    { name: '뼈 추가', price: 15000 },
  ];
  for (const s of singles) {
    await db.menu.create({ data: { ...s, categoryId: cat3.id, isAvailable: true } });
  }

  console.log('✅ Seed 완료');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
