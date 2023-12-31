/*
  Warnings:

  - You are about to drop the column `userId` on the `events` table. All the data in the column will be lost.
  - Added the required column `publisherId` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `Events_userId_fkey`;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `userId`,
    ADD COLUMN `publisherId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_publisherId_fkey` FOREIGN KEY (`publisherId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
