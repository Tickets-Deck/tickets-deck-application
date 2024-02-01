/*
  Warnings:

  - Added the required column `numberOfUsers` to the `Tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tickets` ADD COLUMN `numberOfUsers` INTEGER NOT NULL;
