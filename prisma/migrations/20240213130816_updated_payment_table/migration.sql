-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `paidAt` DATETIME(3) NULL,
    MODIFY `currency` VARCHAR(191) NULL;
