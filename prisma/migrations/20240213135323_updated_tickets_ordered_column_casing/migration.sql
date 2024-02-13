/*
  Warnings:

  - You are about to drop the column `TicketOrdersCount` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `TicketOrdersCount`,
    ADD COLUMN `ticketOrdersCount` INTEGER NOT NULL DEFAULT 0;
