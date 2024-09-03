/*
  Warnings:

  - You are about to drop the column `transactionFee` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `transactionFee`,
    ADD COLUMN `transactionFeeId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `TransactionFee` (
    `id` VARCHAR(191) NOT NULL,
    `percentage` DECIMAL(65, 30) NOT NULL,
    `flatFee` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_transactionFeeId_fkey` FOREIGN KEY (`transactionFeeId`) REFERENCES `TransactionFee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
