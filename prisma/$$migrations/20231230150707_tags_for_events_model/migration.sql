/*
  Warnings:

  - You are about to drop the `_eventstotags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_eventstotags` DROP FOREIGN KEY `_EventsToTags_A_fkey`;

-- DropForeignKey
ALTER TABLE `_eventstotags` DROP FOREIGN KEY `_EventsToTags_B_fkey`;

-- DropTable
DROP TABLE `_eventstotags`;

-- CreateTable
CREATE TABLE `TagsForEvents` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TagsForEvents` ADD CONSTRAINT `TagsForEvents_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagsForEvents` ADD CONSTRAINT `TagsForEvents_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tags`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
