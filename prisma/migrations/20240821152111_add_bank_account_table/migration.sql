-- CreateTable
CREATE TABLE `BankAccounts` (
    `accountId` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `accountName` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`accountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BankAccounts` ADD CONSTRAINT `BankAccounts_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
