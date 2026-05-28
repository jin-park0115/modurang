import { http, HttpResponse } from 'msw';
import { categories, menus, orders } from './data';
import type { Order, OrderPayload } from '@/lib/types';

export const handlers = [
  http.get('/api/categories', () => HttpResponse.json(categories)),

  http.get('/api/menus', ({ request }) => {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    const result = categoryId ? menus.filter((m) => m.categoryId === categoryId) : menus;
    return HttpResponse.json(result);
  }),

  http.get('/api/menus/:id', ({ params }) => {
    const menu = menus.find((m) => m.id === params.id);
    if (!menu) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json(menu);
  }),

  http.post('/api/orders', async ({ request }) => {
    const payload = (await request.json()) as OrderPayload;
    const total = payload.items.reduce((sum, item) => {
      const menu = menus.find((m) => m.id === item.menuId);
      if (!menu) return sum;
      const optionExtra = (menu.optionGroups ?? [])
        .flatMap((g) => g.items)
        .filter((oi) => payload.items.some((pi) => pi.selectedOptionIds.includes(oi.id)))
        .reduce((s, oi) => s + oi.extraPrice, 0);
      return sum + (menu.price + optionExtra) * item.quantity;
    }, 0);

    const order: Order = {
      id: `order-${Date.now()}`,
      status: 'PENDING',
      type: payload.type,
      totalPrice: total,
      estimatedMinutes: payload.type === 'PICKUP' ? 15 : 40,
      createdAt: new Date().toISOString(),
    };
    orders.set(order.id, order);
    return HttpResponse.json(order, { status: 201 });
  }),

  http.get('/api/orders/:id', ({ params }) => {
    const order = orders.get(params.id as string);
    if (!order) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json(order);
  }),
];
