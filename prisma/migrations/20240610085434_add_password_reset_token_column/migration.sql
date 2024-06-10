-- AlterTable
ALTER TABLE `users` ADD COLUMN `passwordResetToken` VARCHAR(191) NULL,
    ADD COLUMN `passwordResetTokenExpiry` DATETIME(3) NULL;
