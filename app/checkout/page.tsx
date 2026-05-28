'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import type { OrderType } from '@/lib/types';
import { Button } from '@/components/ui/button';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR') + '원';
}

const formSchema = z.object({
  phone: z
    .string()
    .regex(/^01[0-9]{8,9}$/, '올바른 휴대폰 번호를 입력해 주세요 (예: 01012345678)'),
  address: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [orderType, setOrderType] = useState<OrderType>('PICKUP');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  if (items.length === 0) {
    router.replace('/');
    return null;
  }

  async function onSubmit(data: FormData) {
    if (orderType === 'DELIVERY' && (!data.address || data.address.trim().length < 5)) {
      setError('address', { message: '주소를 입력해 주세요' });
      return;
    }
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        type: orderType,
        phone: data.phone,
        address: orderType === 'DELIVERY' ? data.address : undefined,
        items: items.map((i) => ({
          menuId: i.menuId,
          quantity: i.quantity,
          selectedOptionIds: i.selectedOptions.map((o) => o.optionItemId),
        })),
      });
      clearCart();
      router.push(`/order/${order.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pb-32">
      <h1 className="text-xl font-bold text-gray-900">주문하기</h1>

      {/* 픽업 / 배달 선택 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="mb-3 font-semibold text-gray-900">수령 방법</p>
        <div className="grid grid-cols-2 gap-3">
          {(['PICKUP', 'DELIVERY'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={`rounded-xl border-2 py-3 text-sm font-bold transition-colors ${
                orderType === type
                  ? 'border-red-600 bg-red-50 text-red-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {type === 'PICKUP' ? '🏪 매장 픽업' : '🛵 배달'}
            </button>
          ))}
        </div>
      </div>

      {/* 연락처 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="mb-3 font-semibold text-gray-900">연락처</p>
        <input
          {...register('phone')}
          type="tel"
          placeholder="01012345678"
          inputMode="numeric"
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* 배달 주소 */}
      {orderType === 'DELIVERY' && (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="mb-3 font-semibold text-gray-900">배달 주소</p>
          <input
            {...register('address')}
            type="text"
            placeholder="도로명 주소를 입력해 주세요"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />
          {errors.address && (
            <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
          )}
        </div>
      )}

      {/* 주문 요약 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="mb-3 font-semibold text-gray-900">주문 내역</p>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.cartItemId} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.menuName} × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t pt-3">
          <span className="font-semibold">합계</span>
          <span className="font-bold text-red-600">{formatPrice(totalPrice())}</span>
        </div>
      </div>

      {/* 결제 방법 (UI mock) */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="mb-3 font-semibold text-gray-900">결제 방법</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-center rounded-xl border-2 border-blue-400 bg-blue-50 py-3 text-sm font-bold text-blue-700">
            💳 카드 결제
          </div>
          <div className="flex items-center justify-center rounded-xl border-2 border-yellow-400 bg-yellow-50 py-3 text-sm font-bold text-yellow-700">
            카카오페이
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">결제 연동 준비 중</p>
      </div>

      {/* 주문 완료 버튼 고정 */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="mx-auto max-w-lg">
          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-xl bg-red-600 text-base font-bold hover:bg-red-700 disabled:opacity-60"
          >
            {submitting ? '주문 중...' : `${formatPrice(totalPrice())} 주문 완료`}
          </Button>
        </div>
      </div>
    </form>
  );
}
