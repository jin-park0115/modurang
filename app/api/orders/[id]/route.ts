import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    id: order.id,
    status: order.status,
    type: order.type,
    totalPrice: order.totalPrice,
    estimatedMinutes: order.estimatedMinutes,
    createdAt: order.createdAt,
  });
}

// 어드민/테스트용: 주문 상태 변경
export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await _req.json();
  const order = await db.order.update({ where: { id }, data: { status } });
  return NextResponse.json({ id: order.id, status: order.status });
}
