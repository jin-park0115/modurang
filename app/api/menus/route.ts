import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get('categoryId') ?? undefined;
  const menus = await db.menu.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(menus);
}
