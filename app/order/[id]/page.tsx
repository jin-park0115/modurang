'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Order } from '@/lib/types';
import { OrderStepper } from '@/components/OrderStepper';
import { Button } from '@/components/ui/button';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR') + '원';
}

const STATUS_MESSAGE: Record<Order['status'], string> = {
  PENDING: '주문을 접수했어요. 매장에서 확인 중입니다.',
  CONFIRMED: '주문이 확인됐어요! 곧 조리를 시작합니다.',
  PREPARING: '맛있게 준비하고 있어요! 조금만 기다려 주세요.',
  READY: '',
  COMPLETED: '주문이 완료됐습니다. 감사합니다! 🙏',
};

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrder(id).then((o) => {
      setOrder(o);
      setLoading(false);
    });
  }, [id]);

  // 5초 폴링
  useEffect(() => {
    if (!order || order.status === 'COMPLETED') return;
    const timer = setInterval(() => {
      api.getOrder(id).then(setOrder);
    }, 5000);
    return () => clearInterval(timer);
  }, [id, order]);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-400">로딩 중...</div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <p className="text-gray-400">주문을 찾을 수 없습니다.</p>
        <Link href="/">
          <Button variant="outline">홈으로</Button>
        </Link>
      </div>
    );
  }

  const isPickup = order.type === 'PICKUP';
  const readyMessage = isPickup
    ? '🎉 준비가 완료됐어요! 매장에 방문해 수령해 주세요.'
    : '🛵 배달이 출발했어요! 곧 도착합니다.';

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">주문 현황</h1>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
            {isPickup ? '매장 픽업' : '배달'}
          </span>
        </div>
        <p className="mb-6 text-sm text-gray-500">
          주문번호: <span className="font-mono text-xs">{order.id}</span>
        </p>

        <OrderStepper status={order.status} />

        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <p className="text-center text-sm text-gray-700">
            {order.status === 'READY' ? readyMessage : STATUS_MESSAGE[order.status]}
          </p>
          {order.estimatedMinutes && order.status !== 'COMPLETED' && order.status !== 'READY' && (
            <p className="mt-1 text-center text-xs text-gray-400">
              예상 소요 시간: 약 {order.estimatedMinutes}분
            </p>
          )}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">결제 금액</span>
          <span className="font-bold text-red-600">{formatPrice(order.totalPrice)}</span>
        </div>
      </div>

      {order.status === 'COMPLETED' && (
        <Link href="/">
          <Button className="w-full rounded-xl bg-red-600 font-bold hover:bg-red-700">
            메뉴 다시 주문하기
          </Button>
        </Link>
      )}
    </div>
  );
}
