import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from './generated/prisma/client';

function createPrisma() {
  const raw = process.env.DATABASE_URL ?? 'file:./dev.db';
  // Vercel 서버리스에서 WebSocket 연결 불가 → libsql:// → https:// 로 변환
  const url = raw.startsWith('libsql://') ? raw.replace('libsql://', 'https://') : raw;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter } as never);
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
