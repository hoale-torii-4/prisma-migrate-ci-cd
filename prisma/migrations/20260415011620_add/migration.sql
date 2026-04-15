-- AlterTable
ALTER TABLE `Post` MODIFY `content` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `fatherName` VARCHAR(191) NULL;
