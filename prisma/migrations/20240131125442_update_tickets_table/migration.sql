/*
  Warnings:

  - You are about to drop the column `role` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `name` to the `Tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tickets` DROP COLUMN `role`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
