/*
  Warnings:

  - You are about to drop the column `ticketOrdersCount` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `ticketsCount` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `ticketOrdersCount`,
    DROP COLUMN `ticketsCount`,
    ADD COLUMN `ticketsBought` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `ticketsSold` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalRevenue` DECIMAL(65, 2) NOT NULL DEFAULT 0;
