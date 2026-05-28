'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR') + '원';
}

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24">
        <p className="text-gray-400">장바구니가 비어있어요.</p>
        <Link href="/">
          <Button variant="outline">메뉴 보러 가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      <h1 className="text-xl font-bold text-gray-900">장바구니</h1>

      {items.map((item) => (
        <div key={item.cartItemId} className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{item.menuName}</p>
              {item.selectedOptions.length > 0 && (
                <p className="mt-0.5 text-sm text-gray-500">
                  {item.selectedOptions.map((o) => o.optionItemName).join(', ')}
                </p>
              )}
            </div>
            <button
              onClick={() => removeItem(item.cartItemId)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-700 hover:bg-gray-100"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-5 text-center font-bold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-700 hover:bg-gray-100"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <span className="font-bold text-red-600">{formatPrice(item.subtotal)}</span>
          </div>
        </div>
      ))}

      {/* 합계 */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">합계</span>
          <span className="text-lg font-bold text-red-600">{formatPrice(totalPrice())}</span>
        </div>
      </div>

      {/* 주문하기 버튼 고정 */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="mx-auto max-w-lg">
          <Button
            onClick={() => router.push('/checkout')}
            className="h-12 w-full rounded-xl bg-red-600 text-base font-bold hover:bg-red-700"
          >
            {formatPrice(totalPrice())} 주문하기
          </Button>
        </div>
      </div>
    </div>
  );
}
