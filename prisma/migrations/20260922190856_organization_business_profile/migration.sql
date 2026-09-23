-- AlterTable
ALTER TABLE "invitation" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "organization" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "altPhone" TEXT,
ADD COLUMN     "brandDescription" TEXT,
ADD COLUMN     "brandTagline" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "fontStyle" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "layoutStyle" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "primaryColor" TEXT,
ADD COLUMN     "secondaryColor" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "website" TEXT;
