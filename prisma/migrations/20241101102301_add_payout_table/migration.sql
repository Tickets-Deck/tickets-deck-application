-- CreateTable
CREATE TABLE `Payouts` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `payoutDate` DATETIME(3) NULL,
    `status` ENUM('1', '2', '3') NOT NULL,
    `paymentMethod` ENUM('1', '2', '3', '4') NOT NULL,
    `transactionRef` VARCHAR(191) NULL,
    `serviceFees` DECIMAL(65, 30) NULL,
    `tax` DECIMAL(65, 30) NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NGN',
    `notes` VARCHAR(191) NULL,
    `organizerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payouts` ADD CONSTRAINT `Payouts_organizerId_fkey` FOREIGN KEY (`organizerId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
