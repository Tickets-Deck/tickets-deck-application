/*
  Warnings:

  - You are about to drop the column `ticketsPurchasedCount` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `ticketsPurchasedCount` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `ticketsPurchasedCount` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `ticketspurchased` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TicketsPurchased` DROP FOREIGN KEY `TicketsPurchased_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `TicketsPurchased` DROP FOREIGN KEY `TicketsPurchased_ticketId_fkey`;

-- DropForeignKey
ALTER TABLE `TicketsPurchased` DROP FOREIGN KEY `TicketsPurchased_userId_fkey`;

-- AlterTable
ALTER TABLE `Events` DROP COLUMN `ticketsPurchasedCount`,
    ADD COLUMN `TicketOrdersCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Tickets` DROP COLUMN `ticketsPurchasedCount`,
    ADD COLUMN `TicketOrdersCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `ticketsPurchasedCount`,
    ADD COLUMN `TicketOrdersCount` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `TicketsPurchased`;

-- CreateTable
CREATE TABLE `TicketOrders` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `ticketId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `totalPrice` DECIMAL(65, 2) NOT NULL,
    `orderStatus` ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL,
    `paymentStatus` ENUM('Pending', 'Paid', 'Failed') NOT NULL,
    `paymentId` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `associatedEmail` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ticketOrderId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 2) NOT NULL,
    `amountPaid` DECIMAL(65, 2) NULL,
    `currency` VARCHAR(191) NOT NULL,
    `paymentStatus` ENUM('Pending', 'Paid', 'Failed') NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TicketOrders` ADD CONSTRAINT `TicketOrders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketOrders` ADD CONSTRAINT `TicketOrders_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketOrders` ADD CONSTRAINT `TicketOrders_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_ticketOrderId_fkey` FOREIGN KEY (`ticketOrderId`) REFERENCES `TicketOrders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
