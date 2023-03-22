/*
  Warnings:

  - You are about to drop the column `categoryId` on the `BookCategory` table. All the data in the column will be lost.
  - Added the required column `category` to the `BookCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BookCategory` DROP FOREIGN KEY `BookCategory_categoryId_fkey`;

-- AlterTable
ALTER TABLE `BookCategory` DROP COLUMN `categoryId`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `BookCategory` ADD CONSTRAINT `BookCategory_category_fkey` FOREIGN KEY (`category`) REFERENCES `Category`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
