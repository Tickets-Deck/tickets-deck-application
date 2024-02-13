/*
  Warnings:

  - The values [Paystack,Flutterwave,Cash,BankTransfer] on the enum `Payment_paymentServiceProvider` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `paymentServiceProvider` ENUM('1', '2', '3', '4') NOT NULL;
