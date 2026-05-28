'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Category, Menu } from '@/lib/types';
import { MenuCard } from '@/components/MenuCard';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getMenus()])
      .then(([cats, mns]) => {
        setCategories(cats);
        setMenus(mns);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMenus =
    activeCategory === 'all' ? menus : menus.filter((m) => m.categoryId === activeCategory);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-400">
        메뉴를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-red-600 text-white'
              : 'border bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          전체
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'border bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 메뉴 목록 */}
      <div className="flex flex-col gap-3">
        {filteredMenus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
        {filteredMenus.length === 0 && (
          <p className="py-12 text-center text-gray-400">메뉴가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
