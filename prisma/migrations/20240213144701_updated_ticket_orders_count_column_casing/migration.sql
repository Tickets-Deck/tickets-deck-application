/*
  Warnings:

  - You are about to drop the column `TicketOrdersCount` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `TicketOrdersCount` on the `tickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Events` DROP COLUMN `TicketOrdersCount`,
    ADD COLUMN `ticketOrdersCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Tickets` DROP COLUMN `TicketOrdersCount`,
    ADD COLUMN `ticketOrdersCount` INTEGER NOT NULL DEFAULT 0;
