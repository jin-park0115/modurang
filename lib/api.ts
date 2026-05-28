import type { Category, Menu, Order, OrderPayload } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getCategories: () => request<Category[]>('/api/categories'),
  getMenus: (categoryId?: string) =>
    request<Menu[]>(`/api/menus${categoryId ? `?categoryId=${categoryId}` : ''}`),
  getMenu: (id: string) => request<Menu>(`/api/menus/${id}`),
  createOrder: (payload: OrderPayload) =>
    request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrder: (id: string) => request<Order>(`/api/orders/${id}`),
};
