/*
  Warnings:

  - You are about to alter the column `price` on the `orderedtickets` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `Decimal(65,30)`.
  - You are about to alter the column `amountPaid` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `Decimal(65,30)`.
  - You are about to alter the column `totalPrice` on the `ticketorders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `Decimal(65,30)`.
  - You are about to alter the column `price` on the `tickets` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `Decimal(65,30)`.
  - You are about to alter the column `totalRevenue` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,2)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `OrderedTickets` MODIFY `price` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `amount` DECIMAL(65, 30) NOT NULL,
    MODIFY `amountPaid` DECIMAL(65, 30) NULL;

-- AlterTable
ALTER TABLE `TicketOrders` MODIFY `totalPrice` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Tickets` MODIFY `price` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Users` MODIFY `totalRevenue` DECIMAL(65, 30) NOT NULL DEFAULT 0;
