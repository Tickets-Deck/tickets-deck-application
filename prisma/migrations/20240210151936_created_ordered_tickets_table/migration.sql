/*
  Warnings:

  - You are about to drop the column `associatedEmail` on the `ticketorders` table. All the data in the column will be lost.
  - You are about to drop the column `ticketId` on the `ticketorders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ticketorders` DROP FOREIGN KEY `TicketOrders_ticketId_fkey`;

-- AlterTable
ALTER TABLE `ticketorders` DROP COLUMN `associatedEmail`,
    DROP COLUMN `ticketId`;

-- CreateTable
CREATE TABLE `OrderedTickets` (
    `id` VARCHAR(191) NOT NULL,
    `ticketId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `associatedEmail` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NOT NULL,
    `price` DECIMAL(65, 2) NOT NULL,
    `orderStatus` ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL,
    `paymentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderedTickets` ADD CONSTRAINT `OrderedTickets_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderedTickets` ADD CONSTRAINT `OrderedTickets_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `TicketOrders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
