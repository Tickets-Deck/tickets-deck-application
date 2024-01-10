/*
  Warnings:

  - Added the required column `imageId` to the `EventImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainImageId` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Made the column `mainImageUrl` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `eventimages` ADD COLUMN `imageId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `events` ADD COLUMN `mainImageId` VARCHAR(191) NOT NULL,
    MODIFY `mainImageUrl` VARCHAR(191) NOT NULL;
