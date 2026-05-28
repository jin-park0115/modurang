import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { OrderPayload } from '@/lib/types';

export async function POST(req: NextRequest) {
  const body: OrderPayload = await req.json();

  // 총 금액 계산
  let totalPrice = 0;
  for (const item of body.items) {
    const menu = await db.menu.findUnique({ where: { id: item.menuId } });
    if (!menu) return NextResponse.json({ error: `Menu ${item.menuId} not found` }, { status: 400 });

    const optionItems = await db.optionItem.findMany({
      where: { id: { in: item.selectedOptionIds } },
    });
    const optionExtra = optionItems.reduce((s, o) => s + o.extraPrice, 0);
    totalPrice += (menu.price + optionExtra) * item.quantity;
  }

  const order = await db.order.create({
    data: {
      type: body.type,
      phone: body.phone,
      address: body.address,
      totalPrice,
      estimatedMinutes: body.type === 'PICKUP' ? 15 : 40,
      items: {
        create: await Promise.all(
          body.items.map(async (item) => {
            const menu = await db.menu.findUniqueOrThrow({ where: { id: item.menuId } });
            const optionItems = await db.optionItem.findMany({
              where: { id: { in: item.selectedOptionIds } },
            });
            const optionExtra = optionItems.reduce((s, o) => s + o.extraPrice, 0);
            return {
              menuId: item.menuId,
              quantity: item.quantity,
              unitPrice: menu.price + optionExtra,
              options: {
                create: item.selectedOptionIds.map((optionItemId) => ({ optionItemId })),
              },
            };
          })
        ),
      },
    },
  });

  return NextResponse.json(
    {
      id: order.id,
      status: order.status,
      type: order.type,
      totalPrice: order.totalPrice,
      estimatedMinutes: order.estimatedMinutes,
      createdAt: order.createdAt,
    },
    { status: 201 }
  );
}
