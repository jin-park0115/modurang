'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import type { Menu, CartOptionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR') + '원';
}

export default function MenuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const totalCount = useCartStore((s) => s.totalCount());

  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [added, setAdded] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api.getMenu(id).then((m) => {
      setMenu(m);
      setLoading(false);
    });
  }, [id]);

  // 3초 후 자동 닫힘
  useEffect(() => {
    if (added) {
      dismissTimer.current = setTimeout(() => setAdded(false), 3000);
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [added]);

  if (loading) {
    return <div className="flex h-48 items-center justify-center text-gray-400">로딩 중...</div>;
  }
  if (!menu) {
    return <div className="py-12 text-center text-gray-400">메뉴를 찾을 수 없습니다.</div>;
  }

  const optionGroups = menu.optionGroups ?? [];

  function toggleOption(groupId: string, itemId: string, maxSelect: number) {
    setSelectedOptions((prev) => {
      const current = prev[groupId] ?? [];
      if (current.includes(itemId)) {
        return { ...prev, [groupId]: current.filter((i) => i !== itemId) };
      }
      if (maxSelect === 1) {
        return { ...prev, [groupId]: [itemId] };
      }
      if (current.length >= maxSelect) return prev;
      return { ...prev, [groupId]: [...current, itemId] };
    });
  }

  function isRequiredGroupsMet() {
    return optionGroups
      .filter((g) => g.required)
      .every((g) => (selectedOptions[g.id] ?? []).length > 0);
  }

  function calcTotal() {
    const optionExtra = optionGroups
      .flatMap((g) => g.items)
      .filter((oi) => Object.values(selectedOptions).flat().includes(oi.id))
      .reduce((sum, oi) => sum + oi.extraPrice, 0);
    return (menu!.price + optionExtra) * quantity;
  }

  function handleAddToCart() {
    if (!isRequiredGroupsMet()) return;

    const cartOptions: CartOptionItem[] = optionGroups.flatMap((g) =>
      (selectedOptions[g.id] ?? []).map((itemId) => {
        const item = g.items.find((i) => i.id === itemId)!;
        return {
          optionGroupId: g.id,
          optionGroupName: g.name,
          optionItemId: item.id,
          optionItemName: item.name,
          extraPrice: item.extraPrice,
        };
      })
    );

    addItem({
      menuId: menu!.id,
      menuName: menu!.name,
      price: menu!.price,
      quantity,
      selectedOptions: cartOptions,
    });

    // 선택 초기화 후 확인 바 표시
    setQuantity(1);
    setSelectedOptions({});
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* 메뉴 정보 */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{menu.name}</h1>
        {menu.description && <p className="mt-1 text-gray-500">{menu.description}</p>}
        <p className="mt-3 text-xl font-bold text-red-600">{formatPrice(menu.price)}</p>
      </div>

      {/* 옵션 그룹 */}
      {optionGroups.map((group) => (
        <div key={group.id} className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{group.name}</span>
              {group.required ? (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                  필수
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  최대 {group.maxSelect}개
                </span>
              )}
            </div>
          </div>
          <ul className="divide-y">
            {group.items.map((item) => {
              const selected = (selectedOptions[group.id] ?? []).includes(item.id);
              return (
                <li key={item.id}>
                  <button
                    onClick={() => toggleOption(group.id, item.id, group.maxSelect)}
                    className={`flex w-full items-center justify-between px-5 py-3 transition-colors ${
                      selected ? 'bg-red-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          selected ? 'border-red-600 bg-red-600' : 'border-gray-300'
                        }`}
                      >
                        {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <span className={selected ? 'font-medium text-red-700' : 'text-gray-700'}>
                        {item.name}
                      </span>
                    </div>
                    {item.extraPrice > 0 && (
                      <span className="text-sm text-gray-500">+{formatPrice(item.extraPrice)}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* 수량 선택 */}
      <div className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 shadow-sm">
        <span className="font-semibold text-gray-900">수량</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-700 hover:bg-gray-100"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-bold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border text-gray-700 hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 하단 고정 영역 */}
      <div className="fixed bottom-0 left-0 right-0">
        {/* 담기 완료 확인 바 */}
        <div
          className={`transition-all duration-300 ${
            added ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="border-t bg-green-50 px-4 py-3">
            <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-green-700">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-sm font-medium">
                  장바구니에 담겼어요! ({totalCount}개)
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAdded(false)}
                  className="rounded-lg border border-green-300 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                >
                  계속 담기
                </button>
                <button
                  onClick={() => router.push('/cart')}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                >
                  장바구니 보기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 담기 버튼 */}
        <div className="border-t bg-white p-4">
          <div className="mx-auto max-w-lg">
            <Button
              onClick={handleAddToCart}
              disabled={!isRequiredGroupsMet()}
              className="h-12 w-full rounded-xl bg-red-600 text-base font-bold hover:bg-red-700 disabled:opacity-40"
            >
              {formatPrice(calcTotal())} 장바구니 담기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
