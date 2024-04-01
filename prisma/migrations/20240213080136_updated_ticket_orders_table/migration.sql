-- DropForeignKey
ALTER TABLE `TicketOrders` DROP FOREIGN KEY `TicketOrders_userId_fkey`;

-- AlterTable
ALTER TABLE `TicketOrders` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `TicketOrders` ADD CONSTRAINT `TicketOrders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
