-- Backfill-safe: the invitation.updatedAt column declared in the schema
-- was never created by 0001 (applied history is immutable, so it is
-- added here). DEFAULT CURRENT_TIMESTAMP keeps the statement safe on
-- non-empty tables; Prisma's @updatedAt owns the value on every update.
-- AlterTable
ALTER TABLE "invitation" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "rate_limit_hit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limit_hit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rate_limit_hit_key_createdAt_idx" ON "rate_limit_hit"("key", "createdAt");
