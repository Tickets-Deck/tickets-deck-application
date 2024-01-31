-- AlterTable
ALTER TABLE `events` ADD COLUMN `bookmarksCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `favoritesCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `ticketsPurchasedCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tickets` ADD COLUMN `ticketsPurchasedCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `bookmarksCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `eventsCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `favoritesCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `followersCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `followingCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `ticketsCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `ticketsPurchasedCount` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Bookmarks` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favorites` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TicketsPurchased` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `ticketId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Followers` (
    `id` VARCHAR(191) NOT NULL,
    `followerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Following` (
    `id` VARCHAR(191) NOT NULL,
    `followingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookmarks` ADD CONSTRAINT `Bookmarks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmarks` ADD CONSTRAINT `Bookmarks_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorites` ADD CONSTRAINT `Favorites_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorites` ADD CONSTRAINT `Favorites_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketsPurchased` ADD CONSTRAINT `TicketsPurchased_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketsPurchased` ADD CONSTRAINT `TicketsPurchased_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketsPurchased` ADD CONSTRAINT `TicketsPurchased_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Followers` ADD CONSTRAINT `Followers_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Following` ADD CONSTRAINT `Following_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
