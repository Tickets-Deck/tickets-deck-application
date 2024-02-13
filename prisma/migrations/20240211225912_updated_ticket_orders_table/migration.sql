/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `TicketOrders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `orderedtickets` DROP FOREIGN KEY `OrderedTickets_orderId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `TicketOrders_orderId_key` ON `TicketOrders`(`orderId`);

-- AddForeignKey
ALTER TABLE `OrderedTickets` ADD CONSTRAINT `OrderedTickets_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `TicketOrders`(`orderId`) ON DELETE RESTRICT ON UPDATE CASCADE;
