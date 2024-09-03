-- AlterTable
ALTER TABLE `TicketOrders` ADD COLUMN `contactFirstName` VARCHAR(191) NULL,
    ADD COLUMN `contactLastName` VARCHAR(191) NULL,
    ADD COLUMN `contactNumber` VARCHAR(191) NULL;