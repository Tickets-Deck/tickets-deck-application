-- DropForeignKey
ALTER TABLE `eventimages` DROP FOREIGN KEY `EventImages_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `tagsforevents` DROP FOREIGN KEY `TagsForEvents_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `tagsforevents` DROP FOREIGN KEY `TagsForEvents_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `Tickets_eventId_fkey`;

-- AddForeignKey
ALTER TABLE `EventImages` ADD CONSTRAINT `EventImages_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tickets` ADD CONSTRAINT `Tickets_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagsForEvents` ADD CONSTRAINT `TagsForEvents_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagsForEvents` ADD CONSTRAINT `TagsForEvents_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
