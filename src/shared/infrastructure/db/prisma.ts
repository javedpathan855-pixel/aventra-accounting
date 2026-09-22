// Single PrismaClient for the Next.js runtime (Prisma 7 + pg driver).
//
// Next.js dev hot-reload would otherwise open a new connection pool per
// reload. The client is built lazily so importing this module (build,
// typecheck, unit tests) never requires credentials or a live database
// — the first real query validates the environment once via getEnv().
//
// Server-only: importing this from a client component is a bug — keep
// it behind server actions, route handlers, and infrastructure.

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma";
import { getEnv } from "@/config/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const buildClient = (): PrismaClient => {
  const adapter = new PrismaPg({ connectionString: getEnv().DATABASE_URL });
  return new PrismaClient({ adapter });
};

const getPrisma = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = buildClient();
  }
  return globalForPrisma.prisma;
};

/** Test seam: drop the cached client between tests. */
const resetPrismaCache = () => {
  globalForPrisma.prisma = undefined;
};

export { getPrisma, resetPrismaCache };
