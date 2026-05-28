'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store';

export function CartHydrator() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
