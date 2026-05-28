import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { CartIcon } from '@/components/CartIcon';
import { MockProvider } from '@/components/MockProvider';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: '모두랑 — 순대국 전문점',
  description: '순대국 브랜드 전용 주문 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-gray-50">
        <MockProvider>
          <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
              <a href="/" className="text-lg font-bold text-red-600">
                모두랑
              </a>
              <CartIcon />
            </div>
          </header>
          <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4">{children}</main>
        </MockProvider>
      </body>
    </html>
  );
}
