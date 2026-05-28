import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Menu } from '@/lib/types';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR') + '원';
}

export function MenuCard({ menu }: { menu: Menu }) {
  return (
    <Link
      href={menu.isAvailable ? `/menu/${menu.id}` : '#'}
      className={`flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow ${
        menu.isAvailable ? 'hover:shadow-md' : 'cursor-not-allowed opacity-50'
      }`}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{menu.name}</span>
          {!menu.isAvailable && (
            <Badge variant="secondary" className="text-xs">
              품절
            </Badge>
          )}
        </div>
        {menu.description && (
          <p className="text-sm text-gray-500 line-clamp-1">{menu.description}</p>
        )}
        <span className="mt-1 font-bold text-red-600">{formatPrice(menu.price)}</span>
      </div>
    </Link>
  );
}
