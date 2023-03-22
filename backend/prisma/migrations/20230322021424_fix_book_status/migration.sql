/*
  Warnings:

  - You are about to drop the column `status` on the `BookCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `BookCategory` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `Books` ADD COLUMN `status` ENUM('AVAILABLE', 'ONBOOKING', 'BORROWED') NOT NULL DEFAULT 'AVAILABLE';
