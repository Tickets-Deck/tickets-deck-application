/*
  Warnings:

  - You are about to drop the column `TicketOrdersCount` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `TicketOrdersCount` on the `tickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `TicketOrdersCount`,
    ADD COLUMN `ticketOrdersCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tickets` DROP COLUMN `TicketOrdersCount`,
    ADD COLUMN `ticketOrdersCount` INTEGER NOT NULL DEFAULT 0;
