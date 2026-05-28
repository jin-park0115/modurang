import type { OrderStatus } from '@/lib/types';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'PENDING', label: '접수' },
  { status: 'CONFIRMED', label: '확인' },
  { status: 'PREPARING', label: '준비 중' },
  { status: 'READY', label: '준비 완료' },
  { status: 'COMPLETED', label: '완료' },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  READY: 3,
  COMPLETED: 4,
};

export function OrderStepper({ status }: { status: OrderStatus }) {
  const currentIndex = STATUS_ORDER[status];

  return (
    <div className="flex items-center justify-between">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step.status} className="flex flex-1 flex-col items-center gap-1">
            <div className="relative flex w-full items-center justify-center">
              {i > 0 && (
                <div
                  className={`absolute right-1/2 top-1/2 h-0.5 w-full -translate-y-1/2 ${
                    done ? 'bg-red-500' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  active
                    ? 'bg-red-600 text-white shadow-md'
                    : done
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
            </div>
            <span
              className={`text-center text-xs ${
                active ? 'font-bold text-red-600' : done ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
