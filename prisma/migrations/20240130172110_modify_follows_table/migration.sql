/*
  Warnings:

  - You are about to drop the `followers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `following` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `totalPrice` to the `TicketsPurchased` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `followers` DROP FOREIGN KEY `Followers_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `following` DROP FOREIGN KEY `Following_followingId_fkey`;

-- AlterTable
ALTER TABLE `ticketspurchased` ADD COLUMN `totalPrice` DECIMAL(65, 30) NOT NULL;

-- DropTable
DROP TABLE `followers`;

-- DropTable
DROP TABLE `following`;

-- CreateTable
CREATE TABLE `Follows` (
    `followerId` VARCHAR(191) NOT NULL,
    `followingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`followerId`, `followingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Follows` ADD CONSTRAINT `Follows_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follows` ADD CONSTRAINT `Follows_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
