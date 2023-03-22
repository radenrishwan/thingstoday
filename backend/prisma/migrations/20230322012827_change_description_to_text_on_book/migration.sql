-- AlterTable
ALTER TABLE `Books` MODIFY `description` TEXT NOT NULL;

-- CreateIndex
CREATE FULLTEXT INDEX `Books_name_author_description_idx` ON `Books`(`name`, `author`, `description`);
