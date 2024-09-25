-- AlterTable
ALTER TABLE `events` ADD COLUMN `organizerPaysFee` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `tickets` ADD COLUMN `visibility` BOOLEAN NOT NULL DEFAULT true;
