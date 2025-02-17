-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PACKAGE', 'EVENT', 'ACCOMMODATION', 'BOOKING', 'ACTIVITY', 'ANNOUNCEMENT', 'CATEGORY', 'DINING', 'FAQ', 'REVIEW', 'ROOM', 'AMENITY', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "isOAuth" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "entityId" INTEGER NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "field" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Translation_entityId_entityType_idx" ON "Translation"("entityId", "entityType");

-- CreateIndex
CREATE INDEX "Translation_language_idx" ON "Translation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_entityId_entityType_field_language_key" ON "Translation"("entityId", "entityType", "field", "language");
