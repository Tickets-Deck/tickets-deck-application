/*
  Warnings:

  - You are about to drop the column `tag` on the `events` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `Events_locationId_fkey`;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `tag`,
    ADD COLUMN `eventId` VARCHAR(191) NOT NULL,
    ADD COLUMN `venue` VARCHAR(191) NULL,
    MODIFY `locationId` VARCHAR(191) NULL,
    MODIFY `time` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Tags` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tags_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EventsToTags` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_EventsToTags_AB_unique`(`A`, `B`),
    INDEX `_EventsToTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventsToTags` ADD CONSTRAINT `_EventsToTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventsToTags` ADD CONSTRAINT `_EventsToTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
