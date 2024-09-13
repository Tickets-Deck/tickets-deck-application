-- AlterTable
ALTER TABLE `couponcodes` ADD COLUMN `maxUsage` INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE `_CouponCodesToEvents` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CouponCodesToEvents_AB_unique`(`A`, `B`),
    INDEX `_CouponCodesToEvents_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CouponCodesToEvents` ADD CONSTRAINT `_CouponCodesToEvents_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouponCodes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouponCodesToEvents` ADD CONSTRAINT `_CouponCodesToEvents_B_fkey` FOREIGN KEY (`B`) REFERENCES `Events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
