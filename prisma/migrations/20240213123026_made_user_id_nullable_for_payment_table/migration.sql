/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `payment` table. All the data in the column will be lost.
  - Added the required column `paymentServiceProvider` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_userId_fkey`;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `paymentMethod`,
    ADD COLUMN `paymentServiceProvider` ENUM('Paystack', 'Flutterwave', 'Cash', 'BankTransfer') NOT NULL,
    MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
