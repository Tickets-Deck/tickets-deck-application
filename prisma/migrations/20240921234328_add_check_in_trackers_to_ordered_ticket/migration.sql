-- AlterTable
ALTER TABLE `orderedtickets` ADD COLUMN `checkedIn` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `checkedInTime` DATETIME(3) NULL;
