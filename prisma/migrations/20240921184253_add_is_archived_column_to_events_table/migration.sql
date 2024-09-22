/*
  Warnings:

  - You are about to drop the column `IsFeatured` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `IsFeatured`,
    ADD COLUMN `isArchived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false;
