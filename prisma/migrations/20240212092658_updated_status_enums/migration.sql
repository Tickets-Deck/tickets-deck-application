/*
  Warnings:

  - The values [Pending,Confirmed,Cancelled] on the enum `TicketOrders_orderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pending,Paid,Failed] on the enum `Payment_paymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pending,Confirmed,Cancelled] on the enum `TicketOrders_orderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pending,Paid,Failed] on the enum `Payment_paymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `OrderedTickets` MODIFY `orderStatus` ENUM('1', '2', '3', '4') NOT NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `paymentStatus` ENUM('1', '2', '3') NOT NULL;

-- AlterTable
ALTER TABLE `TicketOrders` MODIFY `orderStatus` ENUM('1', '2', '3', '4') NOT NULL,
    MODIFY `paymentStatus` ENUM('1', '2', '3') NOT NULL;
