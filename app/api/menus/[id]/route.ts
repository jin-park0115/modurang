import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const menu = await db.menu.findUnique({
    where: { id },
    include: {
      optionGroups: {
        include: { items: true },
      },
    },
  });
  if (!menu) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(menu);
}
